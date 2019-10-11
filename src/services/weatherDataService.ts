import { ForecastData } from "../definitions/apiDefinitions";
import { IProcessedWeatherData } from "../definitions/storeDefinitions";
import _ from "lodash";

const getDayOfTheMonth = (date: number) => {
    return new Date(date * 1000).getDate();
}

const getDayOfTheWeek = (date: number) => {
    return new Date(date * 1000).getDay();
}

const getTime = (date: number) => {
    const data = new Date(date * 1000);
    const hours = data.getHours();
    const minutes = data.getMinutes();

    // Minutes will always be 0, but what the heck
    return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
}

const toCelcius = (tempKelvin: number) => {
    return tempKelvin - 273.15;
}

// TODO: test this for correctness
// TODO: add clouds info
// TODO: add rain info

/**
 * @description Process api data into the format we need
 * @param data 
 */
export const processWeatherData = (data: ForecastData): IProcessedWeatherData => {
    const processWeatherData: IProcessedWeatherData = {
        city: data.city.name,
        future: [],
        hourly: [],
        timestamp: new Date()
    };

    data.list.reduce((acc, curr, index) => {
        // Take the first as the current temprature
        if (index === 0) {
            acc.current = {
                currTemp: toCelcius(curr.main.temp),
                sunrise: data.city.sunrise,
                sunset: data.city.sunset
            }
        }

        // For hourly graph
        acc.hourly.push({
            temp: toCelcius(curr.main.temp),
            time: getTime(curr.dt),
            icon: _.get(curr, "weather[0].icon")
        });

        // Group max/min temps by date
        const last = _.last(acc.future);
        if (last) {
            if (getDayOfTheMonth(curr.dt) !== last.date) {
                acc.future.push({
                    date: getDayOfTheMonth(curr.dt),
                    maxTemp: toCelcius(curr.main.temp),
                    minTemp: toCelcius(curr.main.temp),
                    weekDay: getDayOfTheWeek(curr.dt),
                    recCount: 1,
                    icon: _.get(curr, "weather[0].icon")
                });
            } else {
                const currTemp = toCelcius(curr.main.temp);
                if (currTemp > last.maxTemp) {
                    last.maxTemp = currTemp;
                }

                if (currTemp < last.minTemp) {
                    last.minTemp = currTemp;
                }

                last.recCount++;

                // TODO calculate worse icon for the day
            }
        } else {
            acc.future.push({
                date: getDayOfTheMonth(curr.dt),
                maxTemp: toCelcius(curr.main.temp),
                minTemp: toCelcius(curr.main.temp),
                weekDay: getDayOfTheWeek(curr.dt),
                icon: _.get(curr, "weather[0].icon"),
                recCount: 1
            });
        }


        return acc;
    }, processWeatherData);

    return processWeatherData;
}