# Módulo 5: Asistente IA 24/7 — "NUM Jarvis"

## Arquitectura Propuesta

```
Frontend (Widget) 
  ↓ API REST / WebSocket
Backend (Node.js/Python)
  ↓ Filtrado + Contexto
OpenAI API (GPT-4o-mini / GPT-5)
  ↓
Base de datos de productos (SQLite/PostgreSQL)
```

**No** hacer llamada directa desde frontend a OpenAI (expondría la API key y el system prompt).

---

## Stack Recomendado

| Componente | Tecnología | Justificación |
|------------|-----------|---------------|
| Backend | Node.js + Express | Ligero, rápido de desplegar |
| LLM | OpenAI GPT-4o-mini | Costo: $0.15/1M tokens input |
| Vector DB | Qdrant Cloud (free tier) | Para búsqueda semántica de productos |
| Hosting | Railway / Render | ~$5/mes, escalable |
| Widget | Custom React o embed | Integración limpia con web existente |

---

## Implementación Paso a Paso

### 1. Backend Base (`server.js`)

```javascript
import express from 'express';
import OpenAI from 'openai';
import { QdrantClient } from '@qdrant/js-client-rest';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const qdrant = new QdrantClient({ 
  url: process.env.QDRANT_URL, 
  apiKey: process.env.QDRANT_API_KEY 
});

// Configuración del asistente
const SYSTEM_PROMPT = `Eres NUM Assistant, el asesor experto de NUM Perfume. 
Tu misión: ayudar a clientes a encontrar su fragancia ideal 24/7.

Reglas:
- Responde en español, tono cercano pero profesional
- Máximo 3 frases por respuesta
- Si no sabes algo, di "Déjame consultarlo con el equipo"
- NUNCA inventes productos, precios o stock
- Siempre sugiere el Discovery Set (29€) si el cliente duda
- Usa emojis sutilmente: 🌿✨🎁

Conocimiento del catálogo:
- Familias: amaderada, oriental, fresca, floral, gourmand
- Productos estrella: PISTACHO (gourmand), AURORA (floral), PANTHEON (amaderado)
- Precios: 50ml desde 45€, Discovery Set 29€
- Envío gratis +50€, devolución 30 días`;

// Endpoint principal de chat
app.post('/api/chat', async (req, res) => {
  const { message, sessionId, products } = req.body;
  
  try {
    // Búsqueda semántica de productos relevantes
    const relevantProducts = await searchProducts(message);
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'system', content: `Productos disponibles:\n${JSON.stringify(relevantProducts)}` },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    res.json({ 
      reply: completion.choices[0].message.content,
      products: relevantProducts.slice(0, 3) // Sugerencias
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      reply: 'Disculpa, tengo problemas técnicos. ¿Te atiende un asesor humano?' 
    });
  }
});

// Búsqueda vectorial en catálogo
async function searchProducts(query) {
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query
  });

  const results = await qdrant.search('products', {
    vector: embedding.data[0].embedding,
    limit: 5
  });

  return results.map(r => r.payload);
}

app.listen(3001);
```

### 2. Widget Frontend (`num-jarvis.js`)

```javascript
class NumJarvis {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.sessionId = this.generateSessionId();
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="num-jarvis">
        <div class="chat-messages" id="messages"></div>
        <div class="chat-input">
          <input type="text" id="userInput" placeholder="Pregúntame sobre perfumes...">
          <button onclick="jarvis.send()">➤</button>
        </div>
      </div>
    `;
    this.showMessage('¡Hola! Soy tu asesor NUM. ¿Buscas algo especial?', 'bot');
  }

  async send() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    if (!message) return;

    this.showMessage(message, 'user');
    input.value = '';
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sessionId: this.sessionId })
    });

    const data = await response.json();
    this.showMessage(data.reply, 'bot');
    
    // Mostrar productos sugeridos
    if (data.products?.length) {
      this.showProducts(data.products);
    }
  }

  showMessage(text, sender) {
    const messages = document.getElementById('messages');
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }
}

// Inicialización
const jarvis = new NumJarvis('jarvis-container');
```

### 3. Indexación de Catálogo (`index-products.js`)

```javascript
import { QdrantClient } from '@qdrant/js-client-rest';
import OpenAI from 'openai';

const qdrant = new QdrantClient({ url: process.env.QDRANT_URL });
const openai = new OpenAI();

// Catálogo mínimo de ejemplo
const products = [
  {
    id: 1,
    name: 'PISTACHO',
    family: 'gourmand',
    notes: 'pistacho, avellana, ron, cardamomo',
    description: 'Cremoso, tostado, sofisticado con toque licoroso',
    price: 49,
    gender: 'unisex'
  },
  {
    id: 2,
    name: 'AURORA',
    family: 'floral',
    notes: 'rosa, jazmín, vainilla, ámbar',
    description: 'Femenino, dulce, elegante con estela duradera',
    price: 52,
    gender: 'femenino'
  }
  // ... más productos
];

async function indexProducts() {
  // Crear colección si no existe
  const collections = await qdrant.getCollections();
  if (!collections.collections.find(c => c.name === 'products')) {
    await qdrant.createCollection('products', {
      vectors: { size: 1536, distance: 'Cosine' }
    });
  }

  // Generar embeddings e indexar
  const points = await Promise.all(products.map(async (product, idx) => {
    const text = `${product.name} ${product.family} ${product.notes} ${product.description}`;
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text
    });

    return {
      id: idx,
      vector: embedding.data[0].embedding,
      payload: product
    };
  }));

  await qdrant.upsert('products', { points });
  console.log(`Indexados ${products.length} productos`);
}

indexProducts();
```

---

## Costos Estimados (Mensuales)

| Concepto | Costo | Notas |
|----------|-------|-------|
| OpenAI (GPT-4o-mini) | ~$15-30 | ~1000 conversaciones/día |
| Qdrant Cloud | $0 | Free tier: 1GB |
| Hosting (Railway) | $5 | Backend |
| **Total** | **~$20-35/mes** | Escala con tráfico |

**Optimización:** Cachear respuestas comunes en Redis/Memcached (ej: "¿Envío gratis?") → reduce costos 40%.

---

## Features Avanzadas (Roadmap)

### Fase 2: Inteligencia Contextual
```
[ ] Memoria de conversación (Redis)
[ ] Recomendaciones basadas en historial
[ ] Transferencia a humano cuando detecte frustración
[ ] Análisis de sentimiento en tiempo real
```

### Fase 3: Automatización
```
[ ] Generación automática de respuestas a FAQs
[ ] Upselling inteligente ("Con AURORA te encantará...")
[ ] Captura de leads: "Te envío más info por email"
[ ] Integración con WhatsApp Business API
```

---

## Seguridad y Compliance

```javascript
// Rate limiting básico
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 50, // límite por IP
  message: 'Demasiadas consultas, prueba más tarde'
});

app.use('/api/chat', limiter);

// Filtro de contenido
const BLOCKED_PATTERNS = [
  /precio\s+de\s+competencia/i,
  /ingrediente\s+secreto/i,
  /hackear/i
];

if (BLOCKED_PATTERNS.some(p => p.test(message))) {
  return res.json({ reply: 'Esa consulta no puedo atenderla.' });
}
```

---

## Métricas de Éxito

| KPI | Objetivo (3 meses) |
|-----|-------------------|
| Conversaciones/día | 200+ |
| Tasa de resolución (sin humano) | 85% |
| Conversión desde chat | 15% |
| Tiempo medio respuesta | <3s |
| CSAT (satisfacción) | >4.5/5 |

---

¿Quieres que genere el repositorio completo con Docker y scripts de deploy, o prefieres empezar con un MVP más simple (solo OpenAI sin vector DB)?