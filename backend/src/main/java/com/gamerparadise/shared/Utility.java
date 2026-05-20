package com.gamerparadise.shared;

import java.util.Date;

public class Utility {
    public static long getElapsedTime(Date startDate) {
        return (new Date()).getTime() - startDate.getTime();
    }
}