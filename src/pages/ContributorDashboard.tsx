import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Coins,
  Trophy,
  TrendingUp,
  Star,
  Github,
  Settings,
  Search,
  Target,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ExternalLink,
  User,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

// Mock user data (from your paste.txt file)
const mockUsersData = [
  {
    _id: "684d1622f83fa91c29a332c7",
    email: "prashantnishant80@gmail.com",
    role: "maintainer",
    githubUsername: "NishantSinghhhhh",
    xp: 2450,
    isActive: true,
    coins: 1250,
    weeklyCoinsEarned: 50,
    lastLogin: "2025-06-14T07:46:05.191+00:00",
    createdAt: "2025-06-14T06:26:42.199+00:00",
    githubInfo: {
      name: "Nishant Singh",
      avatar_url: "https://avatars.githubusercontent.com/u/151461374?v=4",
      public_repos: 25,
      followers: 5,
      location: "India",
      bio: "Full-stack developer passionate about open source",
    },
    recentStakes: [
      {
        title: "Fix authentication bug",
        status: "merged",
        xpEarned: 150,
        coinsEarned: 100,
        type: "completed",
      },
      {
        title: "Add dark mode support",
        status: "under review",
        xpStaked: 75,
        coinsStaked: 75,
        type: "pending",
      },
      {
        title: "Optimize database queries",
        status: "ready to stake",
        coinsRequired: 100,
        type: "available",
      },
    ],
  },
  {
    _id: "684d1622f83fa91c29a332c8",
    email: "john.doe@example.com",
    role: "user",
    githubUsername: "johndoe123",
    xp: 3200,
    isActive: true,
    coins: 2100,
    weeklyCoinsEarned: 120,
    lastLogin: "2025-06-13T15:30:22.191+00:00",
    createdAt: "2025-05-20T10:15:30.199+00:00",
    githubInfo: {
      name: "John Doe",
      avatar_url: "/placeholder.svg?height=40&width=40",
      public_repos: 42,
      followers: 15,
      location: "San Francisco, CA",
      bio: "Senior developer with expertise in React and Node.js",
    },
    recentStakes: [
      {
        title: "Implement user authentication",
        status: "merged",
        xpEarned: 200,
        coinsEarned: 150,
        type: "completed",
      },
      {
        title: "Create API documentation",
        status: "merged",
        xpEarned: 100,
        coinsEarned: 80,
        type: "completed",
      },
    ],
  },
  {
    _id: "684d1622f83fa91c29a332c9",
    email: "sarah.wilson@example.com",
    role: "admin",
    githubUsername: "sarahwilson",
    xp: 1800,
    isActive: true,
    coins: 950,
    weeklyCoinsEarned: 80,
    lastLogin: "2025-06-14T09:20:15.191+00:00",
    createdAt: "2025-04-15T14:22:10.199+00:00",
    githubInfo: {
      name: "Sarah Wilson",
      avatar_url: "/placeholder.svg?height=40&width=40",
      public_repos: 18,
      followers: 8,
      location: "London, UK",
      bio: "Frontend specialist with a passion for UI/UX",
    },
    recentStakes: [
      {
        title: "Redesign landing page",
        status: "under review",
        xpStaked: 120,
        coinsStaked: 90,
        type: "pending",
      },
    ],
  },
];

interface UserStats {
  coins: number;
  xp: number;
  rank: string;
  nextRankXP: number;
  repositories: number;
  mergedPRs: number;
  activeBounties: number;
}

interface UserProfile {
  id: string;
  login: string;
  name: string;
  email: string;
  bio: string;
  location: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

interface Stake {
  _id: string;
  title: string;
  status: string;
  xpEarned?: number;
  coinsEarned?: number;
  xpStaked?: number;
  coinsStaked?: number;
  coinsRequired?: number;
  type: string;
  repository?: string;
  createdAt: string;
}

export default function ContributorDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "issues" | "stakes">(
    "overview"
  );
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userStakes, setUserStakes] = useState<Stake[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Mock current user selection (in real app, this would come from auth context)
  const currentUserEmail = "prashantnishant80@gmail.com"; // Change this to test different users

  useEffect(() => {
    loadMockUserData();
  }, []);

  const loadMockUserData = () => {
    // Find current user from mock data
    const user = mockUsersData.find((u) => u.email === currentUserEmail);

    if (user) {
      setCurrentUser(user);

      // Set user profile
      setUserProfile({
        id: user._id,
        login: user.githubUsername,
        name: user.githubInfo.name,
        email: user.email,
        bio: user.githubInfo.bio,
        location: user.githubInfo.location,
        avatar_url: user.githubInfo.avatar_url,
        public_repos: user.githubInfo.public_repos,
        followers: user.githubInfo.followers,
        following: 0,
      });

      // Calculate user stats
      const rank = calculateRank(user.xp);
      setUserStats({
        coins: user.coins,
        xp: user.xp,
        rank: rank,
        nextRankXP: getNextRankXP(user.xp),
        repositories: user.githubInfo.public_repos,
        mergedPRs: user.recentStakes.filter((s) => s.status === "merged")
          .length,
        activeBounties: user.recentStakes.filter((s) => s.type === "pending")
          .length,
      });

      // Transform stakes data
      const stakes = user.recentStakes.map((stake, index) => ({
        _id: `${user._id}_stake_${index}`,
        title: stake.title,
        status: mapStakeStatus(stake.status),
        xpEarned: stake.xpEarned,
        coinsEarned: stake.coinsEarned,
        xpStaked: stake.xpStaked,
        coinsStaked: stake.coinsStaked,
        coinsRequired: stake.coinsRequired,
        type: stake.type,
        repository: getRepositoryFromTitle(stake.title),
        createdAt: user.createdAt,
      }));

      setUserStakes(stakes);
    }
  };

  const calculateRank = (xp: number) => {
    if (xp < 500) return "Code Novice";
    if (xp < 1000) return "Code Apprentice";
    if (xp < 2500) return "Code Contributor";
    if (xp < 5000) return "Code Master";
    if (xp < 7500) return "Code Expert";
    return "Open Source Legend";
  };

  const getNextRankXP = (currentXP: number) => {
    if (currentXP < 500) return 500;
    if (currentXP < 1000) return 1000;
    if (currentXP < 2500) return 2500;
    if (currentXP < 5000) return 5000;
    if (currentXP < 7500) return 7500;
    return 10000;
  };

  const mapStakeStatus = (status: string) => {
    switch (status) {
      case "merged":
        return "accepted";
      case "under review":
        return "pending";
      case "ready to stake":
        return "available";
      default:
        return status;
    }
  };

  const getRepositoryFromTitle = (title: string) => {
    // Mock repository mapping based on title
    const repoMap: { [key: string]: string } = {
      "Fix authentication bug": "user-auth-service",
      "Add dark mode support": "ui-components",
      "Optimize database queries": "backend-api",
      "Implement user authentication": "auth-microservice",
      "Create API documentation": "api-docs",
      "Redesign landing page": "marketing-website",
    };
    return repoMap[title] || "unknown-repo";
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case "Code Novice":
        return "bg-gray-100 text-gray-800";
      case "Code Apprentice":
        return "bg-green-100 text-green-800";
      case "Code Contributor":
        return "bg-blue-100 text-blue-800";
      case "Code Master":
        return "bg-purple-100 text-purple-800";
      case "Code Expert":
        return "bg-yellow-100 text-yellow-800";
      case "Open Source Legend":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStakeStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "expired":
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
      case "available":
        return <Target className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStakeStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      case "available":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const refreshStakes = () => {
    setLoading(true);
    setTimeout(() => {
      loadMockUserData();
      setLoading(false);
    }, 500);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = userStats
    ? ((userStats.xp % 1000) / 1000) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Pull Quest
              </h1>
              <Badge variant="secondary">Contributor</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/contributor/profile")}
              >
                <User className="w-4 h-4 mr-1" />
                Profile
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/contributor/settings")}>
                <Settings className="w-4 h-4 mr-1" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Overview", icon: TrendingUp },
              { id: "issues", label: "Suggested Issues", icon: Target },
              { id: "stakes", label: "My Stakes", icon: Coins },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === id
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage
                      src={userProfile?.avatar_url}
                      alt={userProfile?.login}
                    />
                    <AvatarFallback>
                      {userProfile?.name?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Welcome back,{" "}
                      {userProfile?.name || userProfile?.login || "User"}!
                    </h2>
                    <p className="text-gray-600">
                      Ready to contribute to some amazing projects?
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    className={getRankColor(userStats?.rank || "Code Novice")}
                  >
                    {userStats?.rank || "Code Novice"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Coins className="w-8 h-8 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Virtual Coins
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {userStats?.coins || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-8 h-8 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        XP Points
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {userStats?.xp || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Github className="w-8 h-8 text-gray-700" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Repositories
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {userProfile?.public_repos || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Target className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Active Stakes
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {userStats?.activeBounties || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* XP Progress */}
            {userStats && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Progress to Next Rank</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {userStats.xp} / {userStats.nextRankXP} XP
                      </span>
                      <span className="text-sm text-gray-600">
                        {userStats.nextRankXP - userStats.xp} XP to go
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-3" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="w-full">
                    <Search className="w-4 h-4 mr-2" />
                    Analyze My Repositories
                  </Button>
                  <Button
                    onClick={() => setActiveTab("issues")}
                    variant="outline"
                    className="w-full"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Browse Issues
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "issues" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Suggested Issues
              </h2>
              <div className="flex space-x-2">
                <Button>
                  <Search className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Analyze Repos
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-12 text-center">
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Issues Found
                </h3>
                <p className="text-gray-600 mb-4">
                  Analyze your repositories first to get personalized issue
                  suggestions.
                </p>
                <Button>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze Repositories
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "stakes" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">My Stakes</h2>
              <Button onClick={refreshStakes} disabled={loading}>
                <Search className="w-4 h-4 mr-2" />
                {loading ? "Loading..." : "Refresh"}
              </Button>
            </div>

            {userStakes.length > 0 ? (
              <div className="space-y-4">
                {userStakes.map((stake) => (
                  <Card
                    key={stake._id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getStakeStatusIcon(stake.status)}
                            <Badge
                              className={getStakeStatusColor(stake.status)}
                            >
                              {stake.status.charAt(0).toUpperCase() +
                                stake.status.slice(1)}
                            </Badge>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {stake.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            Repository: {stake.repository}
                          </p>
                          <p className="text-sm text-gray-500">
                            {stake.status === "accepted" &&
                              stake.coinsEarned && (
                                <>Earned: {stake.coinsEarned} coins</>
                              )}
                            {stake.status === "pending" &&
                              stake.coinsStaked && (
                                <>Staked: {stake.coinsStaked} coins</>
                              )}
                            {stake.status === "available" &&
                              stake.coinsRequired && (
                                <>Required: {stake.coinsRequired} coins</>
                              )}
                            {" • "}Created:{" "}
                            {new Date(stake.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          {stake.status === "accepted" && (
                            <div className="text-green-600">
                              <div className="font-semibold">
                                +{stake.coinsEarned} coins
                              </div>
                              <div className="text-sm">
                                +{stake.xpEarned} XP
                              </div>
                            </div>
                          )}
                          {stake.status === "pending" && (
                            <div className="text-yellow-600">
                              <div className="font-semibold">
                                Pending Review
                              </div>
                              <div className="text-sm">
                                Staked: {stake.coinsStaked} coins
                              </div>
                            </div>
                          )}
                          {stake.status === "available" && (
                            <div className="text-blue-600">
                              <div className="font-semibold">
                                Ready to Stake
                              </div>
                              <div className="text-sm">
                                Required: {stake.coinsRequired} coins
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex space-x-2">
                          {stake.status === "accepted" && (
                            <Button size="sm" variant="outline">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              View PR
                            </Button>
                          )}
                          {stake.status === "pending" && (
                            <Button size="sm" variant="outline">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              View PR
                            </Button>
                          )}
                          {stake.status === "available" && (
                            <Button size="sm">
                              <Coins className="w-4 h-4 mr-1" />
                              Stake Now
                            </Button>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          Type: {stake.type}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Coins className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Stakes Yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start by staking on some issues to contribute to open source
                    projects.
                  </p>
                  <Button onClick={() => setActiveTab("issues")}>
                    <Target className="w-4 h-4 mr-2" />
                    Browse Issues
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
