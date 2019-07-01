import { WidgetModelBase } from '../../models/src/index';

export interface IWidgetDataAccess {
    getWidget(name: string): Promise<WidgetModelBase>;
    getAllWidgets(): Promise<WidgetModelBase[]>;
}