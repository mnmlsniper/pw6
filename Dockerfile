# Что используем как эталонный образ
FROM mcr.microsoft.com/playwright:v1.58.2-noble
# Копируем все файлы из текущей директории в образ
COPY . .
RUN npm ci
# Команда по умолчанию
CMD ["npm", "t"]