package com.gamerparadise.shared;

import java.time.Duration;

public class Constants {
    public final static long SECONDS_IN_MINUTE = 60;
    public final static long MINUTES_IN_HOUR = 60;
    public final static long HOURS_IN_DAY = 24;
    public final static long DAYS_IN_WEEK = 7;

    public final static long SECONDS_IN_HOUR = SECONDS_IN_MINUTE * MINUTES_IN_HOUR;
    public final static long SECONDS_IN_DAY = SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY;
    public final static long SECONDS_IN_WEEK = SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY * DAYS_IN_WEEK;
    public final static long MINUTES_IN_DAY = MINUTES_IN_HOUR * HOURS_IN_DAY;
    public final static long MINUTES_IN_WEEK = MINUTES_IN_HOUR * HOURS_IN_DAY * DAYS_IN_WEEK;

    public final static int S3_MAX_KEYS = 1000;
    public final static Duration PRESIGNED_URL_DURATION = Duration.ofHours(1);
    public final static String INSTALLER_FILE_NAME = "GamerParadise-Installer.exe";
}