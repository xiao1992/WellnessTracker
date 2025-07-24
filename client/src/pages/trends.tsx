import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft, BookOpen, Plus, Edit, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "../lib/queryClient";
import { insertDiaryEntrySchema, DiaryEntry } from "@shared/schema";

export default function Diary() {
  const [, navigate] = useLocation();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isAuthenticated = !!user;
  
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  
  const { data: diaryEntries = [] } = useQuery<DiaryEntry[]>({
    queryKey: ['/api/diary-entries'],
    enabled: isAuthenticated,
  });

  const saveDiaryEntry = useMutation({
    mutationFn: async (data: any) => {
      const url = editingEntry ? `/api/diary-entries/${editingEntry.id}` : '/api/diary-entries';
      const method = editingEntry ? 'PUT' : 'POST';
      const res = await apiRequest(method, url, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/diary-entries'] });
      handleCloseDialog();
      toast({
        title: "Success",
        description: editingEntry ? "Diary entry updated!" : "Diary entry saved!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to save diary entry: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const deleteDiaryEntry = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/diary-entries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/diary-entries'] });
      toast({
        title: "Success",
        description: "Diary entry deleted!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete diary entry: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleNewEntry = () => {
    setEditingEntry(null);
    setTitle('');
    setContent('');
    setMood('none');
    setShowNewDialog(true);
  };

  const handleEditEntry = (entry: DiaryEntry) => {
    setEditingEntry(entry);
    setTitle(entry.title || '');
    setContent(entry.content);
    setMood(entry.mood || 'none');
    setShowNewDialog(true);
  };

  const handleCloseDialog = () => {
    setShowNewDialog(false);
    setEditingEntry(null);
    setTitle('');
    setContent('');
    setMood('none');
  };

  const handleSave = () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please write something in your diary entry",
        variant: "destructive",
      });
      return;
    }

    const entryData = {
      date: format(new Date(), 'yyyy-MM-dd'),
      title: title.trim() || null,
      content: content.trim(),
      mood: mood && mood !== 'none' ? mood : null,
      userId: user?.id,
    };

    saveDiaryEntry.mutate(entryData);
  };

  const getMoodColor = (mood: string | null) => {
    switch(mood) {
      case 'happy': return 'bg-yellow-100 text-yellow-800';
      case 'sad': return 'bg-blue-100 text-blue-800';
      case 'excited': return 'bg-orange-100 text-orange-800';
      case 'calm': return 'bg-green-100 text-green-800';
      case 'stressed': return 'bg-red-100 text-red-800';
      case 'grateful': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="mr-4 p-2 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">My Diary</h1>
            </div>
            {isAuthenticated && (
              <Button onClick={handleNewEntry} className="flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                New Entry
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading your diary...</p>
          </div>
        ) : !isAuthenticated ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Please sign in to write in your diary</p>
            <Button onClick={() => navigate('/')}>Go to Home</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {diaryEntries.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Start Your Diary Journey</h3>
                <p className="text-gray-600 mb-6">Write down your thoughts, feelings, and daily experiences</p>
                <Button onClick={handleNewEntry} className="flex items-center mx-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Write Your First Entry
                </Button>
              </div>
            ) : (
              diaryEntries.map((entry) => (
                <Card key={entry.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {entry.title && (
                            <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">{entry.title}</h3>
                          )}
                          {entry.mood && (
                            <Badge className={`${getMoodColor(entry.mood)} flex-shrink-0`}>
                              {entry.mood}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {format(new Date(entry.date), 'MMMM d, yyyy')}
                        </p>
                      </div>
                      <div className="flex space-x-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditEntry(entry)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteDiaryEntry.mutate(entry.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {entry.content}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </main>

      {/* New/Edit Entry Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEntry ? 'Edit Diary Entry' : 'New Diary Entry'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Title (optional)
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your entry a title..."
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Mood (optional)
              </label>
              <Select value={mood} onValueChange={setMood}>
                <SelectTrigger>
                  <SelectValue placeholder="How are you feeling?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No mood selected</SelectItem>
                  <SelectItem value="happy">😊 Happy</SelectItem>
                  <SelectItem value="sad">😢 Sad</SelectItem>
                  <SelectItem value="excited">🎉 Excited</SelectItem>
                  <SelectItem value="calm">😌 Calm</SelectItem>
                  <SelectItem value="stressed">😰 Stressed</SelectItem>
                  <SelectItem value="grateful">🙏 Grateful</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Your thoughts *
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write about your day, thoughts, feelings, or anything on your mind..."
                className="w-full min-h-[200px] resize-none"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={saveDiaryEntry.isPending}
                className="flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {saveDiaryEntry.isPending ? 'Saving...' : 'Save Entry'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>


    </div>
  );
}