import rawData from './kalyanHistorical.json';
import { WeekRecord } from '../types';

export const kalyanHistory: WeekRecord[] = rawData as WeekRecord[];

export const latestWeek = kalyanHistory[kalyanHistory.length - 1];
