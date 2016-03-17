web:
   build: .
   volumes:
    - ./site/:/usr/src/app/site
    - ./server.js:/usr/src/app/server.js
   links:
    - mongodb
   ports:
    - "8888:8888"
   environment:
       CODEFORNOVA_AUTH_SECRET: 
       CODEFORNOVA_ADMIN_USERNAME: 
       CODEFORNOVA_ADMIN_PASSWORD: 
mongodb:
   image: mongo:2.6
