# Install dependencies only when building
FROM node:21 as build
WORKDIR /frontend

# Install dependencies
COPY package*.json ./
RUN npm install -g pnpm && pnpm install
# Copy source files
COPY . .

# Build the application
RUN npx next build

# Run the application
FROM node:21-alpine as runtime
WORKDIR /frontend
COPY --from=build /frontend/node_modules ./node_modules
COPY --from=build /frontend/.next ./
COPY --from=build /frontend/.next/ .next/
EXPOSE 3000
CMD ["npx", "next", "start"]
