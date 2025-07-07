"""
URL configuration for EMP project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from events.api_views import submit_event
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [  # Include the events app URLs
    path('admin/', admin.site.urls),
    path('api/', include('events.urls')),
    path('api/', include('users.urls')),
    path('api/', include('budget.urls')),
    path('api/', include('media.urls')),
    path('api/events/submit/', submit_event, name='submit_event'),
    # path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('api/auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/', include('authentication.urls')),
    path('api/attendance/', include('attendance.urls')),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)