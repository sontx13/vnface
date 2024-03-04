import {
  Action,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import accountReducer from './slice/accountSlide';
import companyReducer from './slice/companySlide';
import userReducer from './slice/userSlide';
import jobReducer from './slice/jobSlide';
import resumeReducer from './slice/resumeSlide';
import voteReducer from './slice/voteSlide';
import resultReducer from './slice/resultSlide';
import attendanceReducer from './slice/attendanceSlide';
import permissionReducer from './slice/permissionSlide';
import roleReducer from './slice/roleSlide';

export const store = configureStore({
  reducer: {
    account: accountReducer,
    company: companyReducer,
    user: userReducer,
    job: jobReducer,
    resume: resumeReducer,
    vote: voteReducer,
    result: resultReducer,
    attendance: attendanceReducer,
    permission: permissionReducer,
    role: roleReducer
  },
});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;