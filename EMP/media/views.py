from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions, parsers
from .models import Media, Document
from .serializers import MediaSerializer, DocumentSerializer

class MediaViewSet(viewsets.ModelViewSet):
    queryset = Media.objects.all()
    serializer_class = MediaSerializer
    permission_classes = [permissions.IsAuthenticated]

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def perform_create(self, serializer):
        print("📥 Incoming FILES:", self.request.FILES)
        print("📥 Incoming DATA:", self.request.data)

        file = self.request.data.get("file")
        if file:
            serializer.save(
                name=file.name,
                type=file.content_type,
                size=file.size,
            )
        else:
            serializer.save()

            