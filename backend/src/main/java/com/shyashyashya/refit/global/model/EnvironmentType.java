package com.shyashyashya.refit.global.model;

public enum EnvironmentType {
    TEST, LOCAL, DEV, MAIN;

    public static EnvironmentType fromString(String profile) {
        return EnvironmentType.valueOf(profile.toUpperCase());
    }
}
