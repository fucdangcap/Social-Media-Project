"use client";

import { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import FollowButton from "./FollowButton";

interface Props {
    user: any;
    currentUserId: string | null;
    isFollowing: boolean;
    followersCount: number;
    followingCount: number;
}

export default function ProfileHeader({ user, currentUserId, isFollowing, followersCount, followingCount }: Props) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const isOwner = currentUserId === user.id;
    const bio = (user.unsafeMetadata?.bio as string) || "Chưa có tiểu sử.";

    return (
        <div className="p-8 border-b border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-black dark:text-white">
                        {user.firstName} {user.lastName}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-gray-500 dark:text-gray-400">
                            @{user.username || (user.emailAddresses[0]?.emailAddress?.split('@')[0])}
                        </p>
                        <span className="bg-gray-100 dark:bg-gray-800 text-xs px-2 py-1 rounded-full text-gray-500">
                            threads.net
                        </span>
                    </div>

                    <p className="mt-4 text-black dark:text-white whitespace-pre-wrap">
                        {bio}
                    </p>

                    <div className="flex gap-4 mt-4 text-gray-500 text-sm">
                        <span><strong className="text-black dark:text-white">{followersCount}</strong> followers</span>
                        <span><strong className="text-black dark:text-white">{followingCount}</strong> following</span>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-4">
                    <img
                        src={user.imageUrl}
                        alt="Profile"
                        className="w-20 h-20 rounded-full border border-gray-200 dark:border-gray-700 object-cover"
                    />

                    {isOwner ? (
                        <button 
                            onClick={() => setIsEditOpen(true)}
                            className="px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                        >
                            Edit Profile
                        </button>
                    ) : (
                        currentUserId && <FollowButton targetUserId={user.id} initialIsFollowing={isFollowing} />
                    )}
                </div>
            </div>

        
            {isOwner && (
                <EditProfileModal 
                    user={user} 
                    isOpen={isEditOpen} 
                    onClose={() => setIsEditOpen(false)} 
                />
            )}
        </div>
    );
}