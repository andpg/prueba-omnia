import { readFile, writeFile } from 'node:fs';

readFile('./input.txt', 'utf8', (err, data) => {
  if (err) throw err;
  const [awaiting_cars, exiting_cars] = data.split("\n99\n").map(str => str.trim().split("\n").map(num => parseInt(num, 10)))
  let parked_cars = []
  let position = new Map()
  for (let car of awaiting_cars)
    position.set(car, car)

  for (let new_pos of exiting_cars) {
    let min_distance = 21
    let parking_car = 0
    for (let car of awaiting_cars) {
      if (! parked_cars.includes(car)) {
        let pos = position.get(car)
        if (pos == new_pos) {
          min_distance = 0
          parking_car = car
          break
        } else if (pos < new_pos && new_pos - pos < min_distance) {
          min_distance = new_pos - pos
          parking_car = car
        } else if (pos > new_pos && 20 + new_pos - pos < min_distance) {
          min_distance = 20 + new_pos - pos
          parking_car = car
        }
      }
    }

    for (let car of awaiting_cars) {
      if (! parked_cars.includes(car)) {
        let pos = position.get(car)
        if (pos + min_distance > 20) {
          position.set(car, pos + min_distance - 20)
        } else {
          position.set(car, pos + min_distance)
        }
      }
    }

    parked_cars.push(parking_car)
  }

  let output = []
  for (let car of awaiting_cars) {
    if (parked_cars.includes(car)) {
      output.push(`El auto de la posición inicial ${car} aparcó en ${position.get(car)}\n`)
    } else {
      output.push(`El auto de la posición inicial ${car} no aparcó\n`)
    }
  }

  writeFile('./output.txt', output.join(''), 'utf8', (err) => {
    if (err) throw err;
    console.log('Guardado en output.txt');
  })
});
