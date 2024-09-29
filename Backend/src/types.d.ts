export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'windy' | 'stormy';

export type Visibility = 'great' | 'good' | 'ok' | 'poor'

export interface DiaryEntrie {
    id: number,
    date: string,
    weather: Weather,
    visibility: Visibility,
    comment: string
}