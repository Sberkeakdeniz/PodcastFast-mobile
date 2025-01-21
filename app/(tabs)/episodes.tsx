import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';

type Episode = {
  id: string;
  title: string;
  duration: string;
  status: 'Draft' | 'Published';
  outlinePoints: string[];
};

export default function Episodes() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [newEpisode, setNewEpisode] = useState({
    title: '',
    duration: '30 min',
    outlinePoints: [
      'Introduction and key points',
      'Main discussion topics',
      'Guest interview segments',
      'Closing thoughts and next steps'
    ]
  });

  const [episodes, setEpisodes] = useState<Episode[]>([
    {
      id: '1',
      title: 'Episode 1',
      duration: '30 min',
      status: 'Draft',
      outlinePoints: [
        'Introduction and key points',
        'Main discussion topics',
        'Guest interview segments',
        'Closing thoughts and next steps'
      ]
    }
  ]);

  const handleSaveEpisode = () => {
    if (newEpisode.title.trim() === '') {
      return;
    }

    if (editingEpisode) {
      // Update existing episode
      setEpisodes(episodes.map(ep => 
        ep.id === editingEpisode.id 
          ? { ...ep, title: newEpisode.title, duration: newEpisode.duration, outlinePoints: newEpisode.outlinePoints }
          : ep
      ));
      setEditingEpisode(null);
    } else {
      // Create new episode
      const newEpisodeData: Episode = {
        id: (episodes.length + 1).toString(),
        title: newEpisode.title,
        duration: newEpisode.duration,
        status: 'Draft',
        outlinePoints: newEpisode.outlinePoints
      };
      setEpisodes([...episodes, newEpisodeData]);
    }

    setIsModalVisible(false);
    setNewEpisode({
      title: '',
      duration: '30 min',
      outlinePoints: [
        'Introduction and key points',
        'Main discussion topics',
        'Guest interview segments',
        'Closing thoughts and next steps'
      ]
    });
  };

  const handleEditEpisode = (episode: Episode) => {
    setEditingEpisode(episode);
    setNewEpisode({
      title: episode.title,
      duration: episode.duration,
      outlinePoints: episode.outlinePoints
    });
    setIsModalVisible(true);
  };

  const handleDeleteEpisode = (episodeId: string) => {
    Alert.alert(
      "Delete Episode",
      "Are you sure you want to delete this episode?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => {
            setEpisodes(episodes.filter(ep => ep.id !== episodeId));
          },
          style: "destructive"
        }
      ]
    );
  };

  const renderRightActions = (episode: Episode) => {
    return (
      <View style={styles.swipeableActions}>
        <TouchableOpacity 
          style={[styles.swipeableButton, styles.editButton]}
          onPress={() => handleEditEpisode(episode)}
        >
          <Ionicons name="pencil" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.swipeableButton, styles.deleteButton]}
          onPress={() => handleDeleteEpisode(episode.id)}
        >
          <Ionicons name="trash" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Episodes</Text>
            <TouchableOpacity 
              style={styles.newButton}
              onPress={() => {
                setEditingEpisode(null);
                setNewEpisode({
                  title: '',
                  duration: '30 min',
                  outlinePoints: [
                    'Introduction and key points',
                    'Main discussion topics',
                    'Guest interview segments',
                    'Closing thoughts and next steps'
                  ]
                });
                setIsModalVisible(true);
              }}
            >
              <Ionicons name="add" size={24} color="#fff" />
              <Text style={styles.newButtonText}>New Episode</Text>
            </TouchableOpacity>
          </View>

          {/* Episode List */}
          <View style={styles.episodeList}>
            {episodes.map((episode) => (
              <Swipeable
                key={episode.id}
                renderRightActions={() => renderRightActions(episode)}
              >
                <View style={styles.episodeCard}>
                  <View style={styles.episodeIcon}>
                    <Ionicons name="mic-outline" size={24} color="#A78BFA" />
                  </View>
                  <View style={styles.episodeInfo}>
                    <View style={styles.episodeHeader}>
                      <Text style={styles.episodeTitle}>{episode.title}</Text>
                      <View style={styles.episodeMeta}>
                        <Text style={styles.episodeStatus}>{episode.status}</Text>
                        <Text style={styles.episodeDuration}>{episode.duration}</Text>
                      </View>
                    </View>
                    <View style={styles.outlinePoints}>
                      {episode.outlinePoints.map((point, index) => (
                        <View key={index} style={styles.outlinePoint}>
                          <View style={styles.bullet} />
                          <Text style={styles.outlineText}>{point}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </Swipeable>
            ))}
          </View>
        </ScrollView>

        {/* Edit/New Episode Modal */}
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingEpisode ? 'Edit Episode' : 'New Episode'}
                </Text>
                <TouchableOpacity onPress={() => {
                  setIsModalVisible(false);
                  setEditingEpisode(null);
                }}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalForm}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Title</Text>
                  <TextInput
                    style={styles.input}
                    value={newEpisode.title}
                    onChangeText={(text) => setNewEpisode({...newEpisode, title: text})}
                    placeholder="Episode 2"
                    placeholderTextColor="#666"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Duration</Text>
                  <TextInput
                    style={styles.input}
                    value={newEpisode.duration}
                    onChangeText={(text) => setNewEpisode({...newEpisode, duration: text})}
                    placeholder="30 min"
                    placeholderTextColor="#666"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Outline Points</Text>
                  {newEpisode.outlinePoints.map((point, index) => (
                    <TextInput
                      key={index}
                      style={styles.input}
                      value={point}
                      onChangeText={(text) => {
                        const newPoints = [...newEpisode.outlinePoints];
                        newPoints[index] = text;
                        setNewEpisode({...newEpisode, outlinePoints: newPoints});
                      }}
                      placeholderTextColor="#666"
                    />
                  ))}
                </View>
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handleSaveEpisode}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </GestureHandlerRootView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  newButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  episodeList: {
    padding: 20,
  },
  episodeCard: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  episodeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#A78BFA20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  episodeInfo: {
    flex: 1,
  },
  episodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  episodeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  episodeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  episodeStatus: {
    color: '#94A3B8',
    marginRight: 8,
  },
  episodeDuration: {
    color: '#94A3B8',
  },
  outlinePoints: {
    marginTop: 8,
  },
  outlinePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#A78BFA',
    marginRight: 8,
  },
  outlineText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalForm: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#94A3B8',
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#2D3748',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    marginBottom: 8,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#2D3748',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  cancelButtonText: {
    color: '#94A3B8',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  swipeableActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  swipeableButton: {
    width: 64,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#3B82F6',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
});
