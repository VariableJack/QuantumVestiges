package com.gamerparadise.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import javax.sql.DataSource;
import java.beans.PropertyVetoException;
import java.util.Map;
import com.mchange.v2.c3p0.ComboPooledDataSource;

import liquibase.integration.spring.SpringLiquibase;

import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueResponse;

import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

@Configuration
public class MyBatisConfig {
    @Autowired
    private SecretsManagerClient secretsManagerClient;
    @Value("${rds.secret}")
    private String rdsSecretId;
    @Value("${spring.liquibase.change-log}")
    private String changeLog;
    private static final Logger logger = LogManager.getLogger(MyBatisConfig.class);

    @Bean
    public TransactionTemplate transactionTemplate(DataSource dataSource) {
        return new TransactionTemplate(new DataSourceTransactionManager(dataSource));
    }

    @Bean
    public DataSource dataSource() {
        final ComboPooledDataSource ds = new ComboPooledDataSource();
        final ObjectMapper mapper = new ObjectMapper();
        final GetSecretValueRequest request = GetSecretValueRequest.builder()
            .secretId(rdsSecretId)
            .build();
        final GetSecretValueResponse response = secretsManagerClient.getSecretValue(request);
        final String secretData = response.secretString();
        try {
            final Map<String, Object> resultMap = mapper.readValue(secretData, Map.class);
            ds.setJdbcUrl(String.format("jdbc:mysql://%s/quantumvestiges?createDatabaseIfNotExist=true", resultMap.get("host").toString()));
            ds.setUser(resultMap.get("username").toString());
            ds.setPassword(resultMap.get("password").toString());
            ds.setDriverClass("com.mysql.cj.jdbc.Driver");

            // C3P0 configuration
            ds.setMaxIdleTime(14400);
            ds.setTestConnectionOnCheckout(true);
            ds.setIdleConnectionTestPeriod(600);
            ds.setPreferredTestQuery("SELECT 1");
            ds.setInitialPoolSize(5);
            ds.setMinPoolSize(5);
            ds.setMaxPoolSize(20);
        } catch (JacksonException e) {
        } catch (PropertyVetoException e) {
        }
        return ds;
    }

    @Bean
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
        SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
        factoryBean.setDataSource(dataSource);
        factoryBean.setTypeAliasesPackage("com.gamerparadise.dao.dto");
        return factoryBean.getObject();
    }

    @Bean
    public SqlSessionTemplate sqlSessionTemplate(SqlSessionFactory sqlSessionFactory) {
        return new SqlSessionTemplate(sqlSessionFactory);
    }

    @Bean
    public SpringLiquibase liquibase(DataSource dataSource) {
        SpringLiquibase liquibase = new SpringLiquibase();
        liquibase.setDataSource(dataSource);
        liquibase.setChangeLog(changeLog);
        return liquibase;
    }
}