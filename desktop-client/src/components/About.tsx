import React, { useState, useEffect } from "react";
import { invoke } from '@tauri-apps/api/core';
import { getVersion } from '@tauri-apps/api/app';
import AnalyticsConsentSwitch from "./AnalyticsConsentSwitch";
import { UpdateDialog } from "./UpdateDialog";
import { updateService, UpdateInfo } from '@/services/updateService';
import { Button } from './ui/button';
import { AudioLines, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';


export function About() {
    const [currentVersion, setCurrentVersion] = useState<string>('0.4.0');
    const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);

    useEffect(() => {
        // Get current version on mount
        getVersion().then(setCurrentVersion).catch(console.error);
    }, []);

    const handleContactClick = async () => {
        try {
            await invoke('open_external_url', { url: 'https://meetflow.app' });
        } catch (error) {
            console.error('Failed to open link:', error);
        }
    };

    const handleCheckForUpdates = async () => {
        setIsChecking(true);
        try {
            const info = await updateService.checkForUpdates(true);
            setUpdateInfo(info);
            if (info.available) {
                setShowUpdateDialog(true);
            } else {
                toast.success('You are running the latest version');
            }
        } catch (error: any) {
            console.error('Failed to check for updates:', error);
            toast.error('Failed to check for updates: ' + (error.message || 'Unknown error'));
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <div className="custom-scrollbar h-[80vh] space-y-5 overflow-y-auto p-5">
            {/* Compact Header */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
                <div className="mb-3 flex justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                        <AudioLines className="h-7 w-7" />
                    </div>
                </div>
                <h1 className="text-xl font-semibold tracking-tight text-slate-950">MeetFlow</h1>
                <span className="text-sm text-slate-500">v{currentVersion}</span>
                <p className="mt-2 text-sm text-slate-600">
                    Real-time notes and summaries that never leave your machine.
                </p>
                <div className="mt-3">
                    <Button
                        onClick={handleCheckForUpdates}
                        disabled={isChecking}
                        variant="outline"
                        size="sm"
                            className="text-xs"
                    >
                        {isChecking ? (
                            <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                Checking...
                            </>
                        ) : (
                            <>
                            <CheckCircle2 className="mr-2 h-3 w-3" />
                                Check for Updates
                            </>
                        )}
                    </Button>
                    {updateInfo?.available && (
                        <div className="mt-2 text-xs text-blue-600">
                            Update available: v{updateInfo.version}
                        </div>
                    )}
                </div>
            </div>

            {/* Features Grid - Compact */}
            <div className="space-y-3">
                <h2 className="text-base font-semibold text-slate-900">MeetFlow profile</h2>
                <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-colors hover:border-blue-200">
                        <h3 className="mb-1 text-sm font-bold text-slate-900">Privacy-first</h3>
                        <p className="text-xs leading-relaxed text-slate-600">Local meeting intelligence for teams that care about data control.</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-colors hover:border-blue-200">
                        <h3 className="mb-1 text-sm font-bold text-slate-900">Model-flexible</h3>
                        <p className="text-xs leading-relaxed text-slate-600">Local and configured provider workflows can coexist.</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-colors hover:border-blue-200">
                        <h3 className="mb-1 text-sm font-bold text-slate-900">Cost-aware</h3>
                        <p className="text-xs leading-relaxed text-slate-600">Optimized desktop processing without pay-per-minute assumptions.</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-colors hover:border-blue-200">
                        <h3 className="mb-1 text-sm font-bold text-slate-900">Desktop-native</h3>
                        <p className="text-xs leading-relaxed text-slate-600">Built for repeated daily capture, review, and summarization.</p>
                    </div>
                </div>
            </div>

            {/* CTA Section - Compact */}
            <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                <h3 className="text-sm font-semibold text-slate-900">Developed by Swagnik Dey</h3>
                <p className="text-sm text-slate-600">
                    MeetFlow is shaped as a focused desktop workspace for private meeting capture.
                </p>
                <button
                    onClick={handleContactClick}
                    className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-blue-700"
                >
                    Visit MeetFlow
                </button>
            </div>

            {/* Footer - Compact */}
            <div className="border-t border-slate-200 pt-2 text-center">
                <p className="text-xs text-slate-400">
                    Developed by Swagnik Dey
                </p>
            </div>
            <AnalyticsConsentSwitch />

            {/* Update Dialog */}
            <UpdateDialog
                open={showUpdateDialog}
                onOpenChange={setShowUpdateDialog}
                updateInfo={updateInfo}
            />
        </div>

    )
}
