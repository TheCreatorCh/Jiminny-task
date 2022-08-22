const tableRow = Array.from(document.getElementsByClassName('table-row-class'))
const tableName = Array.from(document.getElementsByClassName('td-name'))
const tableRoute = Array.from(document.getElementsByClassName('td-route'))
const tableTrainId = Array.from(document.getElementsByClassName('train-id'))
const tableCurrentStation = Array.from(document.getElementsByClassName('td-station'))
const currentTime = document.getElementById('timer')
const railwayRoad = Array.from(document.getElementsByClassName('railway-road'))
const roadClass = document.getElementsByClassName('road-class')
const startButton = document.getElementById('start-button')
const trainsList = document.getElementsByClassName('trains-list')[0]
const stationsList = document.getElementsByClassName('timetable-list')
const subRoute = Array.from(document.getElementsByClassName('td-sub-route'))
const subStation = Array.from(document.getElementsByClassName('sub-station'))

const time = {
    hours: 9,
    minutes: 0
}

const dataArray = [
    {
        trainName: '',
        run: true,
        time: [],
        stations: [],
        train: document.getElementsByClassName('inside-tracker')[0]
    },
    {
        trainName: '',
        run: true,
        time: [],
        stations: [],
        train: document.getElementsByClassName('inside-tracker')[1]
    },
    {
        trainName: '',
        run: true,
        time: [],
        stations: [],
        train: document.getElementsByClassName('inside-tracker')[2]
    },
    {
        trainName: '',
        run: true,
        time: [],
        stations: [],
        train: document.getElementsByClassName('inside-tracker')[3]
    },

]



let isPaused = true
let trainMovingStep = 5

const startRoad = () => {
    isPaused = !isPaused

    for (let j = 0; j < dataArray.length; j++) {
        if (dataArray[j].run) {
            const listElement = document.createElement('li')
            listElement.innerText = dataArray[j].trainName
            trainsList.appendChild(listElement)
        }
    }
    const interval = setInterval(() => {
        if (!isPaused) {
            startButton.innerText = 'Stop'

            if (time.hours === 11) {
                clearInterval(interval)
            } else {
                time.minutes++
                if (time.minutes >= 60) {
                    time.minutes = 0
                    time.hours++
                }
                currentTime.innerText = `${time.hours === 9 ? '0' + time.hours : time.hours}:${time.minutes < 10 ? '0' + time.minutes : time.minutes}`


                for (let i = 0; i < dataArray.length; i++) {
                    if (dataArray[i].time[dataArray[i].time.length - 1] === currentTime.innerText) {
                        dataArray[i].run = false
                        dataArray[i].train.style.left = (trainMovingStep + 3) + 'px'

                        trainsList.innerHTML = ''

                        if (dataArray.some(e => e.run)) {
                            for (let j = 0; j < dataArray.length; j++) {
                                if (dataArray[j].run) {
                                    const listElement = document.createElement('li')
                                    listElement.innerText = dataArray[j].trainName
                                    trainsList.appendChild(listElement)
                                }
                            }
                        } else {
                            const listElement = document.createElement('li')
                            listElement.innerText = 'None'
                            trainsList.appendChild(listElement)
                        }
                    }
                    if (dataArray[i].run) {
                        dataArray[i].train.style.left = trainMovingStep + 'px'
                    }

                    if (dataArray[i].time.some(e => e === currentTime.innerText)) {
                        let timeIndex = dataArray[i].time.findIndex(e => e === currentTime.innerText)
                        tableCurrentStation[i].innerText = dataArray[i].stations[timeIndex + 1] ?? dataArray[i].stations[timeIndex]
                    }
                }
                trainMovingStep += 5
            }
        } else {
            startButton.innerText = 'Start'
        }



    }, 100);
}



fetch('http://localhost:3000/journeys')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        for (let i = 0; i < 4; i++) {
            tableName[i].innerText = data[i].name
            tableRoute[i].innerText = data[i].route
            subRoute[i].innerText = ' / ' + data[i].route
            tableTrainId[i].innerText = data[i].train.name
            dataArray[i].trainName = data[i].train.name


            tableCurrentStation[i].innerText = data[i].timetable[0].station


            let arrivalTime = new Date(data[i].timetable[data[i].timetable.length - 1].time),
                arrivalHours = arrivalTime.getUTCHours(),
                arrivalMinutes = arrivalTime.getUTCMinutes(),
                railwayLength = ((arrivalHours - 9) + (arrivalMinutes / 60)) * 50


            let railwaiId = document.getElementById('road-' + (i + 1))
            railwaiId.style.width = (railwayLength) + '%'

            for (let j = 0; j < data[i].timetable.length; j++) {
                data[i].timetable[j].station

                const stationElement = document.createElement('div')
                const stationImageElement = document.createElement('img')
                const stationLine = document.createElement('hr')
                const stationTime = document.createElement('p')
                const objectDate = new Date(data[i].timetable[j].time)
                const hourCoef = objectDate.getUTCHours() === 9
                    ? '0' + objectDate.getUTCHours()
                    : objectDate.getUTCHours()
                const minuteCoef = objectDate.getMinutes() < 10
                    ? '0' + objectDate.getMinutes()
                    : objectDate.getMinutes()


                stationTime.innerText = `${hourCoef}:${minuteCoef}`


                dataArray[i].time.push(`${hourCoef}:${minuteCoef}`)
                dataArray[i].stations.push(data[i].timetable[j].station)


                stationImageElement.setAttribute('src', './assets/station.svg')
                stationImageElement.classList.add('station-icon')
                stationElement.classList.add('station')

                const secInLength = ((hourCoef - 9) + (minuteCoef / 60)) * 50
                stationElement.style.left = `calc(${secInLength}% - 18.25px)`

                stationElement.appendChild(stationImageElement)
                stationElement.appendChild(stationLine)
                stationElement.appendChild(stationTime)
                railwayRoad[i].appendChild(stationElement)

            }

            for (let a = 0; a < dataArray[i].stations.length; a++) {
                subStation[i].innerText = `${subStation[i].innerText}${dataArray[i].time[a]}: ${dataArray[i].stations[a]}
                `
            }
        }

    });

console.log(dataArray)