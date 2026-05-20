package com.gamerparadise.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import javax.sql.DataSource;
import java.beans.PropertyVetoException;
import java.util.Map;
import com.mchange.v2.c3p0.ComboPooledDataSource;

import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueResponse;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Configuration
public class MyBatisConfig {
    @Autowired
    private SecretsManagerClient secretsManagerClient;

    @Bean
    public DataSource dataSource() {
        final ComboPooledDataSource ds = new ComboPooledDataSource();
        final ObjectMapper mapper = new ObjectMapper();
        //final GetSecretValueRequest request = GetSecretValueRequest.builder()
        //    .secretId("GamerParadiseRDSDevo")
        //    .build();
        //
        //final GetSecretValueResponse response = secretsManagerClient.getSecretValue(request);
        //final String secretData = response.secretString();
        //final Map<String, Object> resultMap = mapper.readValue(secretData, Map.class);
        final Map<String, String> resultMap = Map.of(
            "databaseUrl", "jdbc:mysql://gamerparadise-devo.crm0i0a40wfp.us-west-1.rds.amazonaws.com:3306/gamerparadise",
            "username", "admin",
            "password", "password"
        );
        try {
            ds.setJdbcUrl(resultMap.get("databaseUrl"));
            ds.setUser(resultMap.get("username"));
            ds.setPassword(resultMap.get("password"));
            ds.setDriverClass("com.mysql.cj.jdbc.Driver");
        } catch (PropertyVetoException e) {
        }
        return ds;
    }

    @Bean
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
        SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
        factoryBean.setDataSource(dataSource);
        // factoryBean.setMapperLocations(new PathMatchingResourcePatternResolver()
        //        .getResources("classpath:mappers/*.xml"));
        return factoryBean.getObject();
    }

    @Bean
    public SqlSessionTemplate sqlSessionTemplate(SqlSessionFactory sqlSessionFactory) {
        return new SqlSessionTemplate(sqlSessionFactory);
    }
}