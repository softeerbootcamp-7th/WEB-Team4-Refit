package com.shyashyashya.refit.global.config;

import com.shyashyashya.refit.global.util.ClusterUtil;
import com.shyashyashya.refit.global.util.ElkiClusterUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ClusteringConfig {

    @Bean
    public ClusterUtil clusterUtil() {
        return new ElkiClusterUtil();
    }
}
