using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using SolarMaintenance.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Host=localhost;Port=2818;Database=solar_maintenance;Username=postgres;Password=postgres";

builder.Services.AddDbContext<SolarDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// Enable CORS for frontend development and production
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:3000",
                "http://127.0.0.1:5173",
                "http://localhost:4173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

var app = builder.Build();

// Ensure DB is created and seeded with realistic Shree Abhi data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var db = services.GetRequiredService<SolarDbContext>();
        await DbInitializer.InitializeAsync(db);
        app.Logger.LogInformation("Database initialized and verified successfully.");
    }
    catch (Exception ex)
    {
        app.Logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

app.UseCors("AllowFrontend");

app.UseRouting();

app.MapControllers();

app.MapGet("/api/health", () => Results.Ok(new 
{ 
    status = "healthy", 
    company = "Shree Abhi Electricals & Engineering Pvt. Ltd.", 
    timestamp = DateTime.UtcNow 
}));

app.Run();
