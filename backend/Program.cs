using backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;


// This is the entry point of the web application. It creates a new WebApplication instance
// and configures it using the builder pattern.
var builder = WebApplication.CreateBuilder(args);

// Add endpoints API explorer, which provides a UI for exploring the APIs of the application.
builder.Services.AddEndpointsApiExplorer();

// Add Swagger generator, which generates documentation for the APIs of the application.
builder.Services.AddSwaggerGen();

// Get the connection string for the default database connection from the configuration.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Add a DbContext to the services, which is used to interact with the database.
// The UseMySql method specifies the database provider and the connection string.
// The ServerVersion.AutoDetect method detects the version of the database server.
builder.Services.AddDbContext<ApplicationContext>(options => options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Add controllers to the services, which handle HTTP requests and responses.
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
   options.AddDefaultPolicy(builder =>{
       builder.WithOrigins("http://localhost:3000")
       .AllowAnyHeader()
       .AllowAnyMethod();
   });
});

// Build the WebApplication instance using the configured services.
var app = builder.Build();



// Configure the HTTP request pipeline.
// If the application is running in development environment, enable Swagger UI.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Redirect HTTP requests to HTTPS.
app.UseHttpsRedirection();

// Use the routing middleware to route HTTP requests to the appropriate handlers.
app.UseRouting();

// Use the controller middleware to handle HTTP requests.
app.MapControllers();

// Use the authorization middleware to authorize HTTP requests.
app.UseAuthorization();

app.UseCors();

app.UseMiddleware<Middleware>();

// Start the web server and begin accepting HTTP requests.
app.Run();
