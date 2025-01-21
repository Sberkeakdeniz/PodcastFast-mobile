import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type GuideSection = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  subsections: {
    title: string;
    description: string;
  }[];
};

const guides: GuideSection[] = [
  {
    id: '1',
    title: 'How to Record & Publish Your First Podcast',
    description: 'Step-by-step guide to get started with podcasting',
    icon: 'headset-outline',
    iconColor: '#3B82F6',
    subsections: [
      {
        title: 'Pre-Production',
        description: 'Define your podcast\'s niche, target audience, and format'
      },
      {
        title: 'Recording Setup',
        description: 'Choose your equipment and optimize audio settings'
      },
      {
        title: 'Post-Production',
        description: 'Edit, enhance, and prepare your audio for publishing'
      }
    ]
  },
  {
    id: '2',
    title: 'Essential Equipment Guide for Beginners',
    description: 'Recommended gear to start your podcast',
    icon: 'settings-outline',
    iconColor: '#A78BFA',
    subsections: [
      {
        title: 'Entry-Level Microphones',
        description: 'Best budget-friendly microphones for quality audio'
      },
      {
        title: 'Essential Accessories',
        description: 'Must-have items for a basic recording setup'
      },
      {
        title: 'Optional Upgrades',
        description: 'Recommended upgrades as you grow'
      }
    ]
  },
  {
    id: '3',
    title: 'Beginner\'s Guide to Podcasting',
    description: 'Everything you need to know to get started',
    icon: 'book-outline',
    iconColor: '#EC4899',
    subsections: [
      {
        title: 'Getting Started',
        description: 'Choose your topic, format, and target audience'
      },
      {
        title: 'Growing Your Podcast',
        description: 'Marketing strategies and audience building tips'
      },
      {
        title: 'Monetization',
        description: 'Different ways to earn from your podcast'
      }
    ]
  }
];

type DetailedGuideContent = {
  [key: string]: {
    sections: {
      title: string;
      subsections: {
        title: string;
        items: string[];
      }[];
    }[];
  };
};

const detailedGuides: DetailedGuideContent = {
  '1': {
    sections: [
      {
        title: 'Pre-Production',
        subsections: [
          {
            title: '1. Define Your Podcast\'s Niche',
            items: [
              'Research potential topics and identify your unique angle',
              'Analyze your target audience\'s interests and needs',
              'Check competition and market demand'
            ]
          },
          {
            title: '2. Plan Your Format',
            items: [
              'Choose between solo, interview, or co-hosted format',
              'Determine episode length and frequency',
              'Create a content calendar'
            ]
          },
          {
            title: '3. Develop Your Brand',
            items: [
              'Create a memorable podcast name',
              'Design cover art and visual branding',
              'Write a compelling description'
            ]
          }
        ]
      },
      {
        title: 'Recording Setup',
        subsections: [
          {
            title: '1. Essential Equipment',
            items: [
              'Choose a quality USB or XLR microphone',
              'Get a pop filter and microphone stand',
              'Use headphones for monitoring'
            ]
          },
          {
            title: '2. Recording Software',
            items: [
              'Select recording software (Audacity, GarageBand, etc.)',
              'Configure audio settings',
              'Test recording levels'
            ]
          },
          {
            title: '3. Recording Environment',
            items: [
              'Find a quiet space with minimal echo',
              'Use basic sound treatment if needed',
              'Position microphone correctly'
            ]
          }
        ]
      },
      {
        title: 'Post-Production',
        subsections: [
          {
            title: '1. Audio Editing',
            items: [
              'Remove mistakes and dead air',
              'Add intro/outro music',
              'Balance audio levels'
            ]
          },
          {
            title: '2. Export Settings',
            items: [
              'Choose correct file format (MP3)',
              'Set appropriate bitrate',
              'Add metadata and tags'
            ]
          },
          {
            title: '3. Publishing',
            items: [
              'Select a podcast hosting platform',
              'Submit to podcast directories',
              'Promote on social media'
            ]
          }
        ]
      }
    ]
  },
  '2': {
    sections: [
      {
        title: 'Entry-Level Microphones',
        subsections: [
          {
            title: 'USB Microphones',
            items: [
              'Blue Yeti USB ($129.99) - Versatile, great sound quality, multiple pattern modes',
              'Audio-Technica ATR2100x-USB ($99) - Both USB and XLR outputs, great for future upgrades',
              'Rode NT-USB Mini ($99) - Compact, professional sound, built-in pop filter'
            ]
          },
          {
            title: 'XLR Microphones',
            items: [
              'Shure SM58 ($99) - Industry standard, extremely durable',
              'Rode PodMic ($99) - Specifically designed for podcasting',
              'Audio-Technica AT2020 ($99) - Professional sound at entry-level price'
            ]
          }
        ]
      },
      {
        title: 'Essential Accessories',
        subsections: [
          {
            title: 'Must-Have Items',
            items: [
              'Pop Filter ($10-20) - Reduces plosive sounds',
              'Microphone Stand ($20-30) - Adjustable positioning',
              'Headphones ($50-100) - Audio monitoring',
              'XLR Cables ($15-25) - For XLR microphones',
              'Audio Interface ($99-159) - Required for XLR microphones'
            ]
          }
        ]
      },
      {
        title: 'Optional Upgrades',
        subsections: [
          {
            title: 'Advanced Equipment',
            items: [
              'Acoustic Treatment ($100-200) - Improve room acoustics',
              'DBX 286s Processor ($200) - Professional voice processing',
              'RodeCaster Pro ($599) - All-in-one podcast production studio',
              'Shure SM7B ($399) - Professional broadcast microphone'
            ]
          }
        ]
      }
    ]
  },
  '3': {
    sections: [
      {
        title: 'Getting Started',
        subsections: [
          {
            title: '1. Choose Your Topic',
            items: [
              'Select a topic you\'re passionate about and knowledgeable in',
              'Research market demand and competition',
              'Define your unique value proposition'
            ]
          },
          {
            title: '2. Define Your Format',
            items: [
              'Solo show, co-hosted, interview, or narrative style',
              'Episode length and release schedule',
              'Content structure and segments'
            ]
          },
          {
            title: '3. Target Audience',
            items: [
              'Create listener personas',
              'Understand audience needs and preferences',
              'Tailor content to your target demographic'
            ]
          }
        ]
      },
      {
        title: 'Growing Your Podcast',
        subsections: [
          {
            title: '1. Marketing Strategies',
            items: [
              'Optimize your podcast listing with keywords',
              'Create social media presence',
              'Network with other podcasters',
              'Cross-promote with similar shows'
            ]
          },
          {
            title: '2. Audience Building',
            items: [
              'Engage with listeners on social media',
              'Create additional content (blog, newsletter)',
              'Ask for reviews and ratings',
              'Host contests and giveaways'
            ]
          },
          {
            title: '3. Content Strategy',
            items: [
              'Plan content calendar',
              'Maintain consistent quality',
              'Gather and implement feedback'
            ]
          }
        ]
      },
      {
        title: 'Monetization',
        subsections: [
          {
            title: '1. Sponsorships and Advertising',
            items: [
              'Direct sponsorship deals',
              'Podcast advertising networks',
              'Affiliate marketing'
            ]
          },
          {
            title: '2. Premium Content',
            items: [
              'Membership programs',
              'Exclusive episodes',
              'Bonus content'
            ]
          },
          {
            title: '3. Additional Revenue Streams',
            items: [
              'Merchandise',
              'Live events',
              'Consulting services',
              'Online courses'
            ]
          }
        ]
      }
    ]
  }
};

export default function Guides() {
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);

  const renderDetailedGuide = (guideId: string) => {
    const guide = detailedGuides[guideId];
    return (
      <ScrollView style={styles.modalContent}>
        {guide.sections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.detailedSection}>
            <Text style={styles.detailedSectionTitle}>{section.title}</Text>
            {section.subsections.map((subsection, subsectionIndex) => (
              <View key={subsectionIndex} style={styles.detailedSubsection}>
                <Text style={styles.detailedSubsectionTitle}>{subsection.title}</Text>
                {subsection.items.map((item, itemIndex) => (
                  <View key={itemIndex} style={styles.detailedItem}>
                    <View style={styles.bullet} />
                    <Text style={styles.detailedItemText}>{item}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Podcast Guides</Text>
        
        <View style={styles.guidesList}>
          {guides.map((guide) => (
            <TouchableOpacity key={guide.id} style={styles.guideCard}>
              <View style={[styles.guideIcon, { backgroundColor: guide.iconColor + '20' }]}>
                <Ionicons name={guide.icon} size={24} color={guide.iconColor} />
              </View>
              
              <View style={styles.guideContent}>
                <Text style={styles.guideTitle}>{guide.title}</Text>
                <Text style={styles.guideDescription}>{guide.description}</Text>
                
                <View style={styles.subsectionsList}>
                  {guide.subsections.map((subsection, index) => (
                    <View key={index} style={styles.subsection}>
                      <View style={styles.bullet} />
                      <View style={styles.subsectionContent}>
                        <Text style={styles.subsectionTitle}>{subsection.title}</Text>
                        <Text style={styles.subsectionDescription}>{subsection.description}</Text>
                      </View>
                    </View>
                  ))}
                </View>

                <TouchableOpacity 
                  style={styles.readMoreButton}
                  onPress={() => setSelectedGuide(guide.id)}
                >
                  <Text style={styles.readMoreText}>
                    {guide.id === '1' ? 'Read complete guide' : 
                     guide.id === '2' ? 'View full equipment list' : 
                     'Read complete guide'}
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color="#3B82F6" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={selectedGuide !== null}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedGuide && guides.find(g => g.id === selectedGuide)?.title}
              </Text>
              <TouchableOpacity 
                onPress={() => setSelectedGuide(null)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            {selectedGuide && renderDetailedGuide(selectedGuide)}
          </View>
        </View>
      </Modal>
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  guidesList: {
    gap: 20,
  },
  guideCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
  },
  guideIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  guideContent: {
    gap: 12,
  },
  guideTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  guideDescription: {
    fontSize: 14,
    color: '#94A3B8',
  },
  subsectionsList: {
    marginTop: 8,
    gap: 12,
  },
  subsection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
    marginTop: 6,
    marginRight: 12,
  },
  subsectionContent: {
    flex: 1,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 2,
  },
  subsectionDescription: {
    fontSize: 14,
    color: '#94A3B8',
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 16,
  },
  detailedSection: {
    marginBottom: 24,
  },
  detailedSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  detailedSubsection: {
    marginBottom: 16,
    marginLeft: 16,
  },
  detailedSubsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  detailedItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    marginLeft: 8,
  },
  detailedItemText: {
    color: '#94A3B8',
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
});
