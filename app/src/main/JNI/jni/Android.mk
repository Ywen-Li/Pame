LOCAL_PATH := $(call my-dir)
include $(CLEAR_VARS)



LOCAL_MODULE := core_map
LOCAL_SRC_FILES := CoreMap.c

APP_ABI := armeabi-v7a

include $(BUILD_SHARED_LIBRARY)
