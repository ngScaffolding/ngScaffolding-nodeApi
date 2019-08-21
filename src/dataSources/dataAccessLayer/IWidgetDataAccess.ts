import { WidgetModelBase } from '../../models/index';

export interface IWidgetDataAccess {
    getWidget(name: string): Promise<WidgetModelBase>;
    getAllWidgets(): Promise<WidgetModelBase[]>;
}