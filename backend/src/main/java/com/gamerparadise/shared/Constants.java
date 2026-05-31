package com.gamerparadise.shared;

public class Constants {
    public static long SECONDS_IN_MINUTE = 60;
    public static long MINUTES_IN_HOUR = 60;
    public static long HOURS_IN_DAY = 24;
    public static long DAYS_IN_WEEK = 7;

    public static long SECONDS_IN_HOUR = SECONDS_IN_MINUTE * MINUTES_IN_HOUR;
    public static long SECONDS_IN_DAY = SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY;
    public static long SECONDS_IN_WEEK = SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY * DAYS_IN_WEEK;
    public static long MINUTES_IN_DAY = MINUTES_IN_HOUR * HOURS_IN_DAY;
    public static long MINUTES_IN_WEEK = MINUTES_IN_HOUR * HOURS_IN_DAY * DAYS_IN_WEEK;
}