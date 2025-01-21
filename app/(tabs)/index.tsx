import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import openAIService, { type PodcastContent } from '../../src/services/openai';

type Platform = {
  name: string;
  desc: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

export default function Index() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<PodcastContent | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleGenerate = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const content = await openAIService.generateContent(searchQuery);
      setGeneratedContent(content);
      setExpandedSection('topics'); // Automatically expand the topics section
    } catch (error) {
      console.error('Error generating content:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  const renderExpandableSection = (
    title: string, 
    icon: keyof typeof Ionicons.glyphMap, 
    color: string, 
    subtitle: string | null,
    content: React.ReactNode,
    section: string
  ) => (
    <View style={styles.section}>
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={() => toggleSection(section)}
      >
        <View style={styles.sectionHeaderLeft}>
          <Ionicons name={icon} size={24} color={color} />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <Ionicons 
          name={expandedSection === section ? "chevron-up" : "chevron-down"} 
          size={24} 
          color="#94A3B8" 
        />
      </TouchableOpacity>
      {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
      {expandedSection === section && (
        <View style={styles.expandedContent}>
          {content}
        </View>
      )}
    </View>
  );

  // Render generated topics
  const topicsContent = generatedContent ? (
    <View>
      <Text style={styles.contentHeader}>Popular Topics</Text>
      {generatedContent.popularTopics.map((topic, index) => (
        <View key={index} style={styles.topicItem}>
          <View style={styles.topicBullet} />
          <Text style={styles.topicText}>{topic}</Text>
        </View>
      ))}
      
      <Text style={[styles.contentHeader, styles.marginTop]}>Related Topics</Text>
      {generatedContent.relatedTopics.map((topic, index) => (
        <View key={index} style={styles.topicItem}>
          <View style={styles.topicBullet} />
          <Text style={styles.topicText}>{topic}</Text>
        </View>
      ))}
    </View>
  ) : (
    <Text style={styles.emptyText}>Generate content to see topic suggestions</Text>
  );

  // Render generated analysis
  const analysisContent = generatedContent ? (
    <View>
      {generatedContent.contentAnalysis.introduction && (
        <View style={styles.analysisItem}>
          <Text style={styles.analysisTitle}>Introduction</Text>
          <Text style={styles.analysisText}>{generatedContent.contentAnalysis.introduction}</Text>
        </View>
      )}
      
      <View style={styles.analysisItem}>
        <Text style={styles.analysisTitle}>Main Points</Text>
        {generatedContent.contentAnalysis.mainPoints.map((point, index) => (
          <Text key={index} style={styles.analysisText}>• {point}</Text>
        ))}
      </View>

      {generatedContent.contentAnalysis.conclusion && (
        <View style={styles.analysisItem}>
          <Text style={styles.analysisTitle}>Conclusion</Text>
          <Text style={styles.analysisText}>{generatedContent.contentAnalysis.conclusion}</Text>
        </View>
      )}
    </View>
  ) : (
    <Text style={styles.emptyText}>Generate content to see analysis</Text>
  );

  // Render generated tips
  const tipsContent = generatedContent ? (
    <View>
      {generatedContent.podcastingTips.map((tip, index) => (
        <View key={index} style={styles.tipItem}>
          <Text style={styles.tipNumber}>{index + 1}.</Text>
          <Text style={styles.tipText}>{tip}</Text>
        </View>
      ))}
    </View>
  ) : (
    <Text style={styles.emptyText}>Generate content to see podcasting tips</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>What's your podcast about?</Text>
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="e.g., Technology trends and their impact on society"
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity 
              style={[styles.generateButton, isLoading && styles.generateButtonDisabled]}
              onPress={handleGenerate}
              disabled={isLoading || !searchQuery.trim()}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.generateButtonText}>Generate</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Sections */}
        <View style={styles.content}>
          {renderExpandableSection(
            "AI Generated Topics",
            "bulb-outline",
            "#A78BFA",
            null,
            topicsContent,
            "topics"
          )}

          {renderExpandableSection(
            "Content Analysis",
            "book-outline",
            "#3B82F6",
            "AI-powered insights for your podcast content",
            analysisContent,
            "analysis"
          )}

          {renderExpandableSection(
            "Podcasting Tips",
            "bulb-outline",
            "#A78BFA",
            "Expert recommendations for your show",
            tipsContent,
            "tips"
          )}

          {/* Podcast Platforms Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="mic-outline" size={24} color="#EC4899" />
              <Text style={styles.sectionTitle}>Podcast Platforms</Text>
            </View>
            <Text style={styles.sectionSubtitle}>Popular platforms to host and distribute your podcast</Text>
            
            {/* Platform Items */}
            <View style={styles.platformList}>
              {([
                { name: 'Spotify for Creators', desc: 'Analytics and distribution', icon: 'musical-notes-outline', color: '#22C55E' },
                { name: 'Buzzsprout', desc: 'Easy hosting and analytics', icon: 'radio-outline', color: '#F97316' },
                { name: 'Podbean', desc: 'Monetization and hosting', icon: 'mic-outline', color: '#3B82F6' },
                { name: 'Supercast', desc: 'Premium subscriptions', icon: 'star-outline', color: '#A78BFA' },
                { name: 'RedCircle', desc: 'Dynamic ad insertion', icon: 'radio-outline', color: '#EF4444' },
              ] as Platform[]).map((platform, index) => (
                <TouchableOpacity key={index} style={styles.platformItem}>
                  <View style={[styles.platformIcon, { backgroundColor: platform.color + '20' }]}>
                    <Ionicons name={platform.icon} size={24} color={platform.color} />
                  </View>
                  <View style={styles.platformInfo}>
                    <Text style={styles.platformName}>{platform.name}</Text>
                    <Text style={styles.platformDesc}>{platform.desc}</Text>
                  </View>
                  <Ionicons name="chevron-forward-outline" size={20} color="#666" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 4,
  },
  searchIcon: {
    marginLeft: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  generateButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginLeft: 8,
  },
  generateButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 12,
  },
  sectionSubtitle: {
    color: '#94A3B8',
    marginLeft: 36,
  },
  expandedContent: {
    marginTop: 16,
    marginLeft: 36,
    borderLeftWidth: 2,
    borderLeftColor: '#2D3748',
    paddingLeft: 16,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  topicBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#A78BFA',
    marginRight: 12,
  },
  topicText: {
    color: '#fff',
    fontSize: 16,
  },
  analysisItem: {
    marginBottom: 16,
  },
  analysisTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  analysisText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tipNumber: {
    color: '#A78BFA',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
    width: 24,
  },
  tipText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  platformList: {
    marginTop: 16,
  },
  platformItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  platformIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformInfo: {
    flex: 1,
    marginLeft: 12,
  },
  platformName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  platformDesc: {
    color: '#94A3B8',
    fontSize: 14,
  },
  contentHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  marginTop: {
    marginTop: 24,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  generateButtonDisabled: {
    opacity: 0.7,
  },
});
