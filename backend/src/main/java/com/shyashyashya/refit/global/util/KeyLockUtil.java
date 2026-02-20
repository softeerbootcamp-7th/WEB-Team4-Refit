package com.shyashyashya.refit.global.util;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantLock;
import org.springframework.stereotype.Component;

@Component
public class KeyLockUtil<K> {

    // TODO 여러개의 락을 만들 수 있도록 빈 등록 구조 변경
    private final ConcurrentHashMap<K, ReentrantLock> locks = new ConcurrentHashMap<>();

    public ReentrantLock acquire(K key) {
        ReentrantLock lock = locks.computeIfAbsent(key, k -> new ReentrantLock());
        lock.lock();
        return lock;
    }

    public void release(K key, ReentrantLock lock) {
        try {
            lock.unlock();
        } finally {
            if (!lock.isLocked() && !lock.hasQueuedThreads()) {
                locks.remove(key, lock);
            }
        }
    }
}
