package com.shyashyashya.refit.global.config;

import com.shyashyashya.refit.batch.util.ClusterUtil;
import com.shyashyashya.refit.batch.util.impl.ElkiClusterUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ClusteringConfig {

    @Bean
    public ClusterUtil clusterUtil() {
        return new ElkiClusterUtil();
    }
}
