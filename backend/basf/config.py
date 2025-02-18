from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    SUPABASE_URL: str
    SUPABASE_KEY: str
    OLLAMA_URL: str


env = Settings.model_validate(
    {}
).model_dump()  # https://github.com/pydantic/pydantic/issues/3753
