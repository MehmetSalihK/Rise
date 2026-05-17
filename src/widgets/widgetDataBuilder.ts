import { storageService } from '../services/storageService';

export interface WidgetPayload {
  score: number;
  streak: number;
  status: string;
  color: string;
  updatedAt: string;
}

export const widgetDataBuilder = {
  async syncWidgetData(
    score: number,
    streak: number,
    status: string,
    color: string
  ): Promise<WidgetPayload> {
    const payload: WidgetPayload = {
      score,
      streak,
      status,
      color,
      updatedAt: new Date().toISOString(),
    };

    // 1. Save standard React Native storage bridge
    await storageService.setItem('rise_widget_payload', payload);
    
    // 2. Mocking Native File Bridges: Write to standard bridge so iOS WidgetKit / Android can fetch it instantly
    console.log("Widget synchronisé avec succès :", JSON.stringify(payload));
    
    return payload;
  }
};
