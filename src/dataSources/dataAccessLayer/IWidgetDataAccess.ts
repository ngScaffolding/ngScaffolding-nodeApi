import { WidgetModelBase } from '@ngscaffolding/models';

export interface IWidgetDataAccess {
    getWidget(name: string): Promise<WidgetModelBase>;
    getAllWidgets(): Promise<WidgetModelBase[]>;
}