from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

load_dotenv()

class MongoSettings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix='MONGO_')
    
    DETAILS: str = "mongodb://localhost:27017"

class SecuritySettings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix='JWT_')

    SECRET_KEY: str
    ALGORITHM: str = "HS256"

class Settings(BaseSettings):
    mongodb: MongoSettings = MongoSettings()
    security: SecuritySettings = SecuritySettings()

settings = Settings()
