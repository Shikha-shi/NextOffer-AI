from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DB_CONNECTION: str
    JWT_SECRET_KEY : str
    JWT_ALGORITHM : str ="HS256"
    GEMINI_API_KEY:str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="forbid"
    )


settings = Settings()