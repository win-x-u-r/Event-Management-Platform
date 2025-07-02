from rest_framework import serializers
from .models import Media

class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ['id', 'file', 'media_type', 'name', 'uploaded_by', 'event', 'size']
        read_only_fields = ['uploaded_by', 'size', 'name', 'media_type']

    def create(self, validated_data):
        uploaded_file = self.context['request'].FILES.get('file')
        validated_data['name'] = uploaded_file.name
        validated_data['size'] = uploaded_file.size
        validated_data['media_type'] = uploaded_file.content_type
        validated_data['uploaded_by'] = self.context['request'].user
        return super().create(validated_data)