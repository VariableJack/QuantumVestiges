namespace QuantumVestigesInstaller {
    class BaseConfig {
        public string Env { get; set; } = "";
        public string DownloadFolder { get; set; } = "";
    }
    public partial class QuantumVestigesWindow : System.Windows.Window {
        [System.STAThread]
        public static void Main() {
            System.Windows.Application app = new System.Windows.Application();
            QuantumVestigesWindow windowInstaller = new QuantumVestigesWindow();
            windowInstaller.Show();
            app.Run(windowInstaller);
        }
        private const string ResourceFolder = "assets";
        private const string LauncherZip = "QuantumVestigesLauncher.zip";
        private System.Windows.Controls.TextBlock TxtTitle = null!;
        private System.Windows.Controls.TextBlock TxtStatus = null!;
        private System.Windows.Controls.Button BtnAction = null!;
        private System.Windows.Controls.Grid mainGrid = null!;
        // Directory setup
        private string CompanyName = "Quantum Vestiges";
        private string ProgramFiles = System.Environment.GetFolderPath(System.Environment.SpecialFolder.ProgramFiles);
        private string ApplicationData = System.Environment.GetFolderPath(System.Environment.SpecialFolder.ApplicationData);
        private string LauncherInstallDir;
        private string ApplicationSetupDir;
        private BaseConfig _config = null!;

        public QuantumVestigesWindow () {
            Title = CompanyName;
            Height = 34 + 768 + 35;
            Width = 1408;
            WindowStartupLocation = System.Windows.WindowStartupLocation.CenterScreen;
            Background = new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x12, 0x12, 0x12));
            LauncherInstallDir = System.IO.Path.Combine(ProgramFiles, CompanyName);
            ApplicationSetupDir = System.IO.Path.Combine(ApplicationData, CompanyName);
            SetupConfig();
            BuildManualLayout();
        }
        private void BuildManualLayout() {
            // Core layout grid
            mainGrid = new System.Windows.Controls.Grid { };
            mainGrid.RowDefinitions.Add(new System.Windows.Controls.RowDefinition { Height = System.Windows.GridLength.Auto });
            mainGrid.RowDefinitions.Add(new System.Windows.Controls.RowDefinition { Height = new System.Windows.GridLength(1, System.Windows.GridUnitType.Star) });
            mainGrid.RowDefinitions.Add(new System.Windows.Controls.RowDefinition { Height = System.Windows.GridLength.Auto });
            // 1. Title and Status block
            System.Windows.Controls.StackPanel titlePanel = new System.Windows.Controls.StackPanel { Margin = new System.Windows.Thickness(0, 0, 0, 20) };
            TxtTitle = new System.Windows.Controls.TextBlock {
                Text = CompanyName,
                FontSize = 22,
                FontWeight = System.Windows.FontWeights.Bold,
                Foreground = new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x00, 0xFF, 0xCC))
             };
            TxtStatus = new System.Windows.Controls.TextBlock {
                Text = "Download & Install Launcher",
                FontSize = 12,
                Foreground = new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x8A, 0xA0, 0xA0)),
                Margin = new System.Windows.Thickness(0, 0, 0, 0)
            };
            titlePanel.Children.Add(TxtTitle);
            titlePanel.Children.Add(TxtStatus);
            System.Windows.Controls.Grid.SetRow(titlePanel, 0);
            mainGrid.Children.Add(titlePanel);
            System.Windows.Controls.Panel.SetZIndex(titlePanel, 1);
            // 2. Set background & icon
            System.Windows.Media.ImageSource backgroundSource = SetupImage("background.jpg");
            System.Windows.Media.ImageSource iconSource = SetupImage("icon.jpg");
            System.Windows.Controls.Image backgroundImage = new System.Windows.Controls.Image {
                Stretch = System.Windows.Media.Stretch.UniformToFill,
                Source = backgroundSource,
                Opacity = 1,
                MinHeight = 768,
                MinWidth = 1408,
                MaxHeight = 768,
                MaxWidth = 1408,
            };
            System.Windows.Controls.Grid.SetRow(backgroundImage, 0);
            mainGrid.Children.Add(backgroundImage);
            System.Windows.Controls.Panel.SetZIndex(backgroundImage, 0);
            System.Windows.Controls.Image iconImage = new System.Windows.Controls.Image { Source = iconSource, Width = 64, Height = 64, HorizontalAlignment = System.Windows.HorizontalAlignment.Left };
            // 3. Action Button layout
            BtnAction = new System.Windows.Controls.Button {
                Content = "INSTALL",
                Height = 35,
                Width = 120,
                HorizontalAlignment = System.Windows.HorizontalAlignment.Right,
                FontWeight = System.Windows.FontWeights.Bold,
                BorderThickness = new System.Windows.Thickness(0),
                Background = new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x00, 0xFF, 0xCC)), Foreground = new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x12, 0x12, 0x12)),
                Visibility = System.Windows.Visibility.Visible
            };
            BtnAction.Click += BtnAction_Click;
            System.Windows.Controls.Grid.SetRow(BtnAction, 2);
            mainGrid.Children.Add(BtnAction);

            Content = mainGrid;
        }

        private System.Windows.Media.ImageSource SetupImage(string filename) {
            System.Reflection.Assembly assembly = System.Reflection.Assembly.GetExecutingAssembly();
            string resourceName = $"{assembly.GetName().Name}.{ResourceFolder}.{filename}";

            using (System.IO.Stream? stream = assembly.GetManifestResourceStream(resourceName)) {
                if (stream == null) {
                    System.Windows.MessageBox.Show($"Could not find embedded resource: {resourceName}", "Failed to set up image");
                }
                System.Windows.Media.Imaging.BitmapImage bitmap = new System.Windows.Media.Imaging.BitmapImage();
                bitmap.BeginInit();
                bitmap.StreamSource = stream;
                bitmap.CacheOption = System.Windows.Media.Imaging.BitmapCacheOption.OnLoad;
                bitmap.EndInit();
                System.Windows.Media.Imaging.WriteableBitmap neutralSource = new System.Windows.Media.Imaging.WriteableBitmap(bitmap);
                neutralSource.Freeze();
                return neutralSource;
            }
        }

        private void SetupConfig() {
            System.Reflection.Assembly assembly = System.Reflection.Assembly.GetExecutingAssembly();
            string resourceName = $"{assembly.GetName().Name}.assets.config.json";
            using (System.IO.Stream? stream = assembly.GetManifestResourceStream(resourceName)) {
                if (stream == null) throw new System.IO.FileNotFoundException("Target configuration missing.");
                using (System.IO.StreamReader reader = new System.IO.StreamReader(stream)) {
                    string jsonText = reader.ReadToEnd();
                    _config = System.Text.Json.JsonSerializer.Deserialize<BaseConfig>(jsonText) ?? new BaseConfig();
                }
            }
        }

        private async void BtnAction_Click(object sender, System.Windows.RoutedEventArgs e) {
            string launcherZipTempPath = System.IO.Path.Combine(System.IO.Path.GetTempPath(), CompanyName);
            string launcherZipFullPath = System.IO.Path.Combine(launcherZipTempPath, $"{LauncherZip}");
            BtnAction.IsEnabled = false;
            try {
                if (!System.IO.Directory.Exists(launcherZipTempPath)) System.IO.Directory.CreateDirectory(launcherZipTempPath);
                TxtStatus.Text = $"Downloading {CompanyName}'s Launcher";
                await DownloadContent($"{_config.DownloadFolder}/{LauncherZip}", launcherZipFullPath);
                TxtStatus.Text = "Setting up local directories and extracting files";
                await System.Threading.Tasks.Task.Run(() => {
                    if (!System.IO.Directory.Exists(ApplicationSetupDir)) System.IO.Directory.CreateDirectory(ApplicationSetupDir);
                    if (!System.IO.Directory.Exists(LauncherInstallDir)) System.IO.Directory.CreateDirectory(LauncherInstallDir);
                    System.IO.Compression.ZipFile.ExtractToDirectory(launcherZipFullPath, LauncherInstallDir, true);
                    System.IO.File.Delete(launcherZipFullPath);
                    System.IO.Directory.Delete(launcherZipTempPath, recursive: true);
                });
                TxtStatus.Text = $"Finished downloading {CompanyName}'s Launcher";
            } catch (System.Exception ex) {
                TxtStatus.Text = $"Failed to download {CompanyName}'s Launcher";
                System.Windows.MessageBox.Show(ex.Message, "Failed to set up launcher", System.Windows.MessageBoxButton.OK, System.Windows.MessageBoxImage.Information);
            } finally {
                BtnAction.IsEnabled = true;
            }
        }

        private async System.Threading.Tasks.Task DownloadContent(string url, string destinationPath)
        {
            using System.Net.Http.HttpClient client = new System.Net.Http.HttpClient();
            using System.Net.Http.HttpResponseMessage response = await client.GetAsync(url, System.Net.Http.HttpCompletionOption.ResponseHeadersRead);
            response.EnsureSuccessStatusCode();

            long? totalBytes = response.Content.Headers.ContentLength;
            using System.IO.Stream downloadStream = await response.Content.ReadAsStreamAsync();
            using System.IO.FileStream fileStream = new System.IO.FileStream(destinationPath, System.IO.FileMode.Create, System.IO.FileAccess.Write, System.IO.FileShare.None, 8192, true);

            byte[] buffer = new byte[8192];
            int readBytes;

            while ((readBytes = await downloadStream.ReadAsync(buffer, 0, buffer.Length)) > 0) {
                await fileStream.WriteAsync(buffer, 0, readBytes);
            }
        }
    }
}
