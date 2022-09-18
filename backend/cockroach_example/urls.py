from django.contrib import admin
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from .views import PingView, NotesView

urlpatterns = [
    path('admin/', admin.site.urls),

    path('ping/', PingView.as_view()),

    # # Endpoints for customers URL.
    # path('customer/', CustomersView.as_view(), name='customers'),
    # path('customer/<uuid:id>/', CustomersView.as_view(), name='customers'),

    # # Endpoints for customers URL.
    # path('product/', ProductView.as_view(), name='product'),
    # path('product/<uuid:id>/', ProductView.as_view(), name='product'),

    # path('order/', OrdersView.as_view(), name='order'),
    path('notes/', csrf_exempt(NotesView.as_view())),
    path('notes/<uuid:id>/', csrf_exempt(NotesView.as_view()), name='notes')
]
