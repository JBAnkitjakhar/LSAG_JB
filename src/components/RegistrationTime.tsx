// src/components/RegistrationTimer.tsx

import React, { useEffect, useState } from 'react';
import { getRegistrationEndTime } from '@/utils/blockchainUtils';

const RegistrationTimer = () => {
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    } | null>(null);
    const [isExpired, setIsExpired] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEndTime = async () => {
            try {
                setError(null);
                const endTime = await getRegistrationEndTime();
                updateTimeLeft(endTime);
            } catch (err) {
                console.error('Error fetching end time:', err);
                setError('Unable to fetch registration end time. Please try again later.');
            }
        };

        fetchEndTime();
        const interval = setInterval(fetchEndTime, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    const updateTimeLeft = (endTime: bigint) => {
        const updateTimer = () => {
            const now = BigInt(Math.floor(Date.now() / 1000));
            const diff = endTime - now;

            if (diff <= 0n) {
                setIsExpired(true);
                setTimeLeft(null);
                return;
            }

            const diffNumber = Number(diff);
            const days = Math.floor(diffNumber / (24 * 60 * 60));
            const hours = Math.floor((diffNumber % (24 * 60 * 60)) / (60 * 60));
            const minutes = Math.floor((diffNumber % (60 * 60)) / 60);
            const seconds = diffNumber % 60;

            setTimeLeft({ days, hours, minutes, seconds });
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);
        return () => clearInterval(timer);
    };

    if (error) {
        return (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                {error}
            </div>
        );
    }

    if (isExpired) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                Registration period has ended
            </div>
        );
    }

    if (!timeLeft) {
        return (
            <div className="animate-pulse bg-gray-100 p-4 rounded">
                Loading registration time...
            </div>
        );
    }

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Registration Time Remaining
            </h3>
            <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white p-2 rounded shadow">
                    <div className="text-2xl font-bold text-blue-600">{timeLeft.days}</div>
                    <div className="text-sm text-gray-600">Days</div>
                </div>
                <div className="bg-white p-2 rounded shadow">
                    <div className="text-2xl font-bold text-blue-600">{timeLeft.hours}</div>
                    <div className="text-sm text-gray-600">Hours</div>
                </div>
                <div className="bg-white p-2 rounded shadow">
                    <div className="text-2xl font-bold text-blue-600">{timeLeft.minutes}</div>
                    <div className="text-sm text-gray-600">Minutes</div>
                </div>
                <div className="bg-white p-2 rounded shadow">
                    <div className="text-2xl font-bold text-blue-600">{timeLeft.seconds}</div>
                    <div className="text-sm text-gray-600">Seconds</div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationTimer;