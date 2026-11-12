from fastapi import FastAPI

from app.routers import users, auth
from app.models import user
from app.database import engine, Base
from app.models import complaint
from app.routers import complaints

Base.metadata.create_all(bind=engine)

app = FastAPI()


app.include_router(users.router)
app.include_router(complaints.router)
app.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"]
)