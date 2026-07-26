import { fbDb, fbStorage, fbReady, fbInitError, reportCloudError } from '../firebase.js';
import { doc, setDoc, deleteDoc, collection, query, onSnapshot } from 'fb/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'fb/storage';

    export const cloud = {
      async pushSession(session) {
        if (!fbDb) return reportCloudError('Đồng bộ buổi tập thất bại', new Error(fbInitError || 'Firestore chưa khởi tạo được'));
        try {
          await fbReady;
          await setDoc(doc(fbDb, 'sessions', `${session.profileId}_${session.id}`), session);
        } catch (e) { reportCloudError('Đồng bộ buổi tập thất bại', e); }
      },
      async deleteSession(profileId, sessionId) {
        if (!fbDb) return;
        try {
          await fbReady;
          await deleteDoc(doc(fbDb, 'sessions', `${profileId}_${sessionId}`));
        } catch (e) { reportCloudError('Xoá buổi tập trên cloud thất bại', e); }
      },
      async pushWeight(profileId, entry) {
        if (!fbDb) return reportCloudError('Đồng bộ cân nặng thất bại', new Error(fbInitError || 'Firestore chưa khởi tạo được'));
        try {
          await fbReady;
          await setDoc(doc(fbDb, 'weights', `${profileId}_${entry.at}`), { ...entry, profileId });
        } catch (e) { reportCloudError('Đồng bộ cân nặng thất bại', e); }
      },
      async pushCustomEx(profileId, ex) {
        if (!fbDb) return reportCloudError('Đồng bộ bài tập thất bại', new Error(fbInitError || 'Firestore chưa khởi tạo được'));
        try {
          await fbReady;
          await setDoc(doc(fbDb, 'customExercises', `${profileId}_${ex.id}`), { ...ex, profileId });
        } catch (e) { reportCloudError('Đồng bộ bài tập thất bại', e); }
      },
      async uploadPhoto(blob, sessionId) {
        if (!fbStorage) throw new Error(fbInitError || 'Firebase Storage chưa khởi tạo được');
        await fbReady;
        const sref = storageRef(fbStorage, `journal/${sessionId}.jpg`);
        await uploadBytes(sref, blob, { contentType: 'image/jpeg' });
        return getDownloadURL(sref);
      },
      listenSessions(cb) {
        if (!fbDb) return () => { };
        let unsub = () => { }, cancelled = false;
        fbReady.then(() => {
          if (cancelled) return;
          unsub = onSnapshot(query(collection(fbDb, 'sessions')), snap => cb(snap.docs.map(d => d.data())), e => reportCloudError('Không tải được Nhật ký từ cloud', e));
        });
        return () => { cancelled = true; unsub(); };
      },
      listenWeights(profileId, cb) {
        if (!fbDb) return () => { };
        let unsub = () => { }, cancelled = false;
        fbReady.then(() => {
          if (cancelled) return;
          unsub = onSnapshot(query(collection(fbDb, 'weights')), snap => cb(snap.docs.map(d => d.data()).filter(w => w.profileId === profileId)), e => reportCloudError('Không tải được cân nặng từ cloud', e));
        });
        return () => { cancelled = true; unsub(); };
      }
    };
