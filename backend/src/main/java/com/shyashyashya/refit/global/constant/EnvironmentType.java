package com.shyashyashya.refit.global.constant;

public enum EnvironmentType {
    LOCAL, DEV, MAIN;

    public static EnvironmentType from(String value) {
        return EnvironmentType.valueOf(value.toUpperCase());
    }
}
