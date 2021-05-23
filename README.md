# Generador de hora redactada

## Pasos para ejecución
Se necesita Node.js para la ejecución de este código.
```bash
# Instalación de TypeScript
npm install -g typescript ts-node @types/node
# Ejecución del programa
ts-node ./redact-hour.ts <hora>:<minutos><AM/PM>
```

## Ejemplos
```
ts-node ./redact-hour.ts 12:45pm
Son las doce y cuarenta y cinco de la noche

ts-node ./redact-hour.ts 1:00am
Es la una en punto de la mañana

ts-node ./redact-hour.ts 2:15pm
Son las dos y cuarto de la tarde

ts-node ./redact-hour.ts 9:30pm
Son las nueve y media de la noche

ts-node ./redact-hour.ts 4:53am
Son las cuatro y cincuenta y tres de la mañana
```