package com.shyashyashya.refit.global.config;

import com.shyashyashya.refit.global.property.ClusteringProperty;
import com.shyashyashya.refit.global.util.ClusterUtil;
import com.shyashyashya.refit.global.util.ElkiClusterUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class ClusteringConfig {

    private final ClusteringProperty clusteringProperty;

    @Bean
    public ClusterUtil clusterUtil() {
        return new ElkiClusterUtil(clusteringProperty);
    }
}
