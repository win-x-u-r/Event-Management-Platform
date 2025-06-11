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


urlpatterns = [  # Include the events app URLs
    path('admin/', admin.site.urls),
    path('api/', include('events.urls')),
    path('api/', include('users.urls')),
    path('api/', include('budget.urls')),
    path('api/', include('media.urls')),
    path('api/events/submit/', submit_event, name='submit_event'),
]
