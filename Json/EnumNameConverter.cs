using System.Text.Json;
using System.Text.Json.Serialization;

namespace TodoApi.Json;

public class EnumNameConverterFactory : JsonConverterFactory
{
    public override bool CanConvert(Type typeToConvert) => typeToConvert.IsEnum;

    public override JsonConverter CreateConverter(Type typeToConvert, JsonSerializerOptions options)
    {
        var converterType = typeof(EnumNameConverter<>).MakeGenericType(typeToConvert);
        return (JsonConverter)Activator.CreateInstance(converterType)!;
    }
}

public class EnumNameConverter<TEnum> : JsonConverter<TEnum> where TEnum : struct, Enum
{
    public override TEnum Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.TokenType == JsonTokenType.String ? reader.GetString() : null;
        var allowedNames = Enum.GetNames<TEnum>();
        var matchingName = allowedNames.FirstOrDefault(name => string.Equals(name, value, StringComparison.OrdinalIgnoreCase));

        if (matchingName is null)
        {
            throw new JsonException($"{typeof(TEnum).Name} must be one of: {string.Join(", ", allowedNames)}.");
        }

        return Enum.Parse<TEnum>(matchingName);
    }

    public override void Write(Utf8JsonWriter writer, TEnum value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.ToString());
    }
}
