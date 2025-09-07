# 🎭 Sistema de Animaciones - Framer Motion

Sistema de animaciones limpio y escalable implementado con Framer Motion, siguiendo principios **KISS**, **SOLID** y **DRY**.

## 🚀 Uso Básico

### Importar Componentes

```typescript
import { 
  AnimatedBox, 
  AnimatedButton, 
  useAnimations 
} from '@/components/ui/animated';
```

### Animaciones Simples

```typescript
function MyComponent() {
  const animation = useAnimations({ preset: 'fade', delay: 0.2 });
  
  return (
    <AnimatedBox {...animation}>
      Contenido animado
    </AnimatedBox>
  );
}
```

## 🎨 Presets Disponibles

| Preset | Uso | Efecto |
|--------|-----|--------|
| `fade` | Elementos que aparecen | Fade in/out |
| `page` | Páginas del dashboard | Slide up + fade |
| `card` | Cards interactivas | Scale + hover effects |
| `modal` | Modales y overlays | Scale + backdrop |
| `list` | Contenedores de lista | Stagger children |
| `listItem` | Elementos de lista | Slide + fade |

## 📦 Componentes Disponibles

### Componentes Base
- `AnimatedBox` - Contenedor versátil
- `AnimatedPaper` - Para cards y containers
- `AnimatedButton` - Botones con feedback
- `AnimatedCard` - Cards interactivas

### Componentes Especializados
- `PageContainer` - Para páginas del dashboard
- `InteractiveCard` - Cards con hover effects
- `ListContainer` - Para listas animadas
- `ModalContainer` - Para modales

### Modales Animados
- `AnimatedModal` - Modal base reutilizable
- `AnimatedConfirmModal` - Modal de confirmación
- `AnimatedLoadingModal` - Modal de loading

## 🔧 Hooks Disponibles

### `useAnimations(options)`
Hook principal para configurar animaciones.

```typescript
const animation = useAnimations({
  preset: 'fade',
  delay: 0.2,
  disabled: false
});
```

### `useListAnimations(itemCount, options)`
Para listas con animaciones staggered.

```typescript
const listAnim = useListAnimations(items.length, {
  staggerDelay: 0.1
});

return (
  <ListContainer {...listAnim.container}>
    {items.map((item, index) => (
      <ListItem key={item.id} {...listAnim.item}>
        {item.content}
      </ListItem>
    ))}
  </ListContainer>
);
```

### `useInViewAnimations(options)`
Para animaciones activadas por scroll.

```typescript
const { ref, ...animation } = useInViewAnimations({
  threshold: 0.3,
  triggerOnce: true
});

return <AnimatedBox ref={ref} {...animation} />;
```

### `useModalAnimations(isOpen)`
Para modales con backdrop animado.

```typescript
const { backdrop, modal } = useModalAnimations(isOpen);
```

## 💡 Ejemplos de Uso

### Página del Dashboard

```typescript
import { PageContainer, usePageAnimations } from '@/components/ui/animated';

function DashboardPage() {
  const pageAnim = usePageAnimations();
  
  return (
    <PageContainer {...pageAnim}>
      <h1>Mi Dashboard</h1>
      {/* Contenido */}
    </PageContainer>
  );
}
```

### Lista Animada

```typescript
import { ListContainer, ListItem, useListAnimations } from '@/components/ui/animated';

function AnimatedList({ items }) {
  const listAnim = useListAnimations(items.length);
  
  return (
    <ListContainer {...listAnim.container}>
      {items.map((item, index) => (
        <ListItem key={item.id} {...listAnim.item}>
          <Card>{item.content}</Card>
        </ListItem>
      ))}
    </ListContainer>
  );
}
```

### Modal Animado

```typescript
import { AnimatedModal } from '@/components/ui/animated';

function MyModal({ open, onClose }) {
  return (
    <AnimatedModal
      open={open}
      onClose={onClose}
      title="Mi Modal"
      actions={
        <Button onClick={onClose}>Cerrar</Button>
      }
    >
      <p>Contenido del modal</p>
    </AnimatedModal>
  );
}
```

### Card Interactiva

```typescript
import { InteractiveCard } from '@/components/ui/animated';

function ProductCard({ product }) {
  return (
    <InteractiveCard onClick={() => viewProduct(product.id)}>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
    </InteractiveCard>
  );
}
```

## ⚡ Performance Tips

1. **Usa `disabled: true`** para deshabilitar animaciones en mobile si es necesario
2. **Evita animar muchos elementos** simultáneamente
3. **Usa `will-change`** solo cuando sea necesario
4. **Prefiere `transform`** sobre `position` para mejor performance

## 🎯 Mejores Prácticas

1. **Consistencia**: Usa siempre los mismos presets para elementos similares
2. **Timing**: Mantén duraciones cortas (0.2s-0.3s) para mejor UX
3. **Accesibilidad**: Respeta `prefers-reduced-motion`
4. **Performance**: No animes demasiados elementos a la vez

## 🛠️ Personalización

### Crear Animación Personalizada

```typescript
import { useCustomAnimation } from '@/components/ui/animated';

const customAnim = useCustomAnimation('fade', {
  transition: { duration: 0.5 },
  variants: {
    visible: { opacity: 1, scale: 1.1 }
  }
});
```

### Crear Transición Personalizada

```typescript
import { createTransition } from '@/components/ui/animated';

const customTransition = createTransition(0.4, 'easeOut', 0.1);
```

## 🔄 Migración desde Componentes Estáticos

### Antes
```typescript
<Box sx={{ padding: 2 }}>
  <Paper elevation={2}>
    Contenido
  </Paper>
</Box>
```

### Después
```typescript
<AnimatedBox {...useAnimations({ preset: 'fade' })} sx={{ padding: 2 }}>
  <AnimatedPaper {...useAnimations({ preset: 'card' })} elevation={2}>
    Contenido
  </AnimatedPaper>
</AnimatedBox>
```

## 📊 Bundle Size Impact

- **Framer Motion**: ~25KB gzipped
- **Sistema de animaciones**: ~5KB gzipped
- **Total**: ~30KB (~1% del bundle típico)

El sistema usa **tree-shaking** para incluir solo las animaciones que uses.
