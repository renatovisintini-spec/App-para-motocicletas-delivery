# App para motocicletas

Versión mejorada del proyecto original de gestión horaria para una flota de 8 motocicletas.

## Objetivo

Permitir asignar una motocicleta disponible a una franja horaria y liberarla posteriormente para que vuelva a quedar disponible.

## Tecnologías

- HTML5 semántico
- CSS3 responsive con Grid y Flexbox
- JavaScript vanilla (DOM, eventos, arrays, objetos y gestión de estado)

## Mejoras respecto del proyecto original

- HTML válido y semántico.
- Diseño responsive para escritorio, tablet y móvil.
- Sustitución de `float` por CSS Grid/Flexbox.
- Horarios generados automáticamente con JavaScript.
- Estado de asignaciones centralizado y más fácil de mantener.
- Variables descriptivas y uso consistente de `const`/`let`.
- Eliminación de código de depuración y reglas CSS repetitivas.
- Indicadores visibles de motos disponibles y en uso.
- Leyenda de estados e información accesible mediante `aria-live`.
- Interfaz visual modernizada.

## Uso

1. Abre `index.html` en un navegador moderno.
2. Pulsa una franja horaria disponible para asignar automáticamente una motocicleta.
3. Pulsa nuevamente una franja asignada para liberar la motocicleta.
4. Cuando las 8 motocicletas están en uso, no se permiten nuevas asignaciones hasta liberar una.

## Estructura

```text
App para motocicletas/
├── index.html
├── README.md
├── css/
│   ├── gestion.css
│   └── normalize.css
└── js/
    └── app.js
```
