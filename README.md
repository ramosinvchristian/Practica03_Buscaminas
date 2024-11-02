# [Práctica 03] Minesweeper

**Autor:** Christian Alberth Ramos Manzanares
**Fecha de entrega:** 28 de octubre  

## Objetivo

Demostrar la competencia básica de programación del lado del cliente desarrollando el conocido juego del buscaminas utilizando HTML, CSS y JavaScript.

## Requerimientos

- Antes de iniciar el juego, se debe pedir al usuario el tamaño del tablero (cantidad de renglones y columnas) y la cantidad de minas que tendrá el juego. 
- El tamaño mínimo para el tablero es de **5 x 5**. 
- Además del tamaño personalizado, se debe permitir seleccionar un tamaño por nivel de dificultad:
  - Fácil
  - Medio
  - Difícil
  - Muy Difícil
  - Hardcore
  - Leyenda

Para cada nivel de dificultad, el usuario elegirá el tamaño y la cantidad de minas.

### Reglas del juego

- En el primer turno, el jugador no puede perder (no puede caer en una mina). Si el usuario selecciona una mina en el primer turno, se debe recalcular el tablero y colocar las minas de nuevo.
- Al seleccionar una casilla, se debe mostrar el número de minas que están alrededor de esa casilla. También se deben destapar las casillas adyacentes que no contienen minas.
- El juego termina cuando se han destapado todas las casillas que no tienen minas.

### Funcionalidad opcional

- Implementar la funcionalidad de marcar una casilla que se cree que tiene una mina (colocando una banderita, como en el juego original).

## Entregables

1. Carpeta en formato ZIP con los archivos de código del proyecto.
2. Imágenes que evidencien el funcionamiento del juego.
3. URL de donde está publicado el juego.

## Notas

- No se puede utilizar ningún framework ni librerías front-end, solo **Vanilla JavaScript**.
