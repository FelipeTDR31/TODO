FROM mcr.microsoft.com/dotnet/sdk:8.0
WORKDIR /backend

COPY . .
RUN dotnet restore

RUN dotnet build -c Release -o /app/build

EXPOSE 5002
CMD ["dotnet", "watch", "run"]
